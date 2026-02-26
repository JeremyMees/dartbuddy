export function useGame() {
  const route = useRoute()
  const gameId = computed(() => route.params.id as string)
  const cacheKey = `game-${gameId.value}`
  const statsCacheKey = `game-stats-${gameId.value}`

  const { data: cachedGame } = useNuxtData<GameFull>(cacheKey)
  const { data: cachedStats } =
    useNuxtData<PlayerAggregatedStats[]>(statsCacheKey)

  const {
    data: game,
    pending,
    error,
    refresh,
  } = useLazyAsyncData(
    cacheKey,
    (_nuxtApp, { signal }) =>
      $fetch<GameFull>(`/api/games/${gameId.value}`, { signal }),
    { ...(cachedGame.value && { default: () => cachedGame.value }) },
  )

  const { data: stats, refresh: refreshStats } = useLazyAsyncData(
    statsCacheKey,
    (_nuxtApp, { signal }) =>
      $fetch<PlayerAggregatedStats[]>(`/api/games/${gameId.value}/stats`, {
        signal,
      }),
    { ...(cachedStats.value && { default: () => cachedStats.value }) },
  )

  watch(error, (newError) => {
    if (newError?.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Game not found',
        fatal: true,
      })
    }
  })

  const players = computed(() => {
    if (!game.value) return []
    return game.value.players.map((player) =>
      calculatePlayerStats(game.value!, player, stats.value ?? []),
    )
  })

  const activePlayerStats = computed(() =>
    players.value.find((p) => p.playerId === game.value?.activePlayerId),
  )

  const isMatchOver = computed(() => !!game.value?.winnerId)

  const currentSet = computed<GameSet | null>(
    () => game.value?.sets.at(-1) ?? null,
  )

  const currentLeg = computed<GameLeg | null>(
    () => currentSet.value?.legs.at(-1) ?? null,
  )

  let previousGameState: GameFull | undefined

  function optimistic(transform: (current: GameFull) => GameFull) {
    return {
      onRequest() {
        previousGameState = cachedGame.value

        if (cachedGame.value) {
          cachedGame.value = transform(cachedGame.value)
        }
      },
      onResponseError() {
        cachedGame.value = previousGameState
      },
    }
  }

  function computeGameMutations(
    gameSnapshot: GameFull,
    setSnapshot: GameSet,
    legSnapshot: GameLeg,
    activePlayerId: string,
    isWin: boolean,
  ): Omit<TurnActionState, 'legId'> {
    if (!isWin) {
      const nextPlayerId = getNextPlayerId(gameSnapshot, activePlayerId)
      return nextPlayerId
        ? { gameUpdate: { activePlayerId: nextPlayerId } }
        : {}
    }

    const now = new Date().toISOString()

    const legUpdate = {
      legId: legSnapshot.id,
      winnerId: activePlayerId,
      endedAt: now,
    }

    const legsWonInSet =
      setSnapshot.legs.filter((l) => l.winnerId === activePlayerId).length + 1

    if (legsWonInSet < gameSnapshot.legsToWin) {
      return {
        legUpdate,
        newLeg: {
          setId: setSnapshot.id,
          number: setSnapshot.legs.length + 1,
        },
        gameUpdate: {
          activePlayerId: getNextPlayerId(gameSnapshot, activePlayerId),
        },
      }
    }

    const setUpdate = {
      setId: setSnapshot.id,
      winnerId: activePlayerId,
      endedAt: now,
    }

    const setsWon =
      gameSnapshot.sets.filter((s) => s.winnerId === activePlayerId).length + 1

    if (setsWon >= gameSnapshot.setsToWin) {
      return {
        legUpdate,
        setUpdate,
        gameUpdate: {
          winnerId: activePlayerId,
          completedAt: now,
          endReason: 'COMPLETED',
        },
      }
    }

    return {
      legUpdate,
      setUpdate,
      newSet: { number: gameSnapshot.sets.length + 1 },
      gameUpdate: {
        activePlayerId: getNextPlayerId(gameSnapshot, activePlayerId),
      },
    }
  }

  async function updateGame(
    updates: Partial<
      Pick<
        GameFull,
        | 'activePlayerId'
        | 'startPlayerId'
        | 'winnerId'
        | 'completedAt'
        | 'endReason'
      >
    >,
  ) {
    if (!cachedGame.value) return

    await $fetch(`/api/games/${gameId.value}`, {
      method: 'PATCH',
      body: updates,
      ...optimistic((current) => {
        const merged = { ...current, ...updates }

        if (updates.winnerId) {
          merged.winner = findPlayer(current, updates.winnerId)
        } else if (updates.winnerId === null) {
          merged.winner = null
        }

        return merged as GameFull
      }),
    })
  }

  async function submitTurn(data: {
    throws: Array<{ segment: string; scored: number }>
    isBust: boolean
  }) {
    if (
      !cachedGame.value ||
      !currentSet.value ||
      !currentLeg.value ||
      !activePlayerStats.value
    ) {
      return
    }

    const gameSnapshot = cachedGame.value
    const setSnapshot = currentSet.value
    const legSnapshot = currentLeg.value
    const activePlayerId = gameSnapshot.activePlayerId

    if (!activePlayerId) return

    const startingScore = activePlayerStats.value.points
    const totalScored = data.throws.reduce((sum, t) => sum + t.scored, 0)
    const remaining = data.isBust ? startingScore : startingScore - totalScored
    const isWin = remaining === 0 && !data.isBust
    const tempId = `temp-${Date.now()}`

    const optimisticTurn: GameTurn = {
      id: tempId,
      legId: legSnapshot.id,
      playerId: activePlayerId,
      startedAt: new Date(),
      startingScore,
      totalScored,
      remainingScore: remaining,
      isBust: data.isBust,
      _count: { throws: data.throws.length },
    }

    const mutations = computeGameMutations(
      gameSnapshot,
      setSnapshot,
      legSnapshot,
      activePlayerId,
      isWin,
    )

    const diff = await $fetch<TurnDiff>(`/api/games/${gameId.value}/turns`, {
      method: 'POST',
      body: {
        legId: legSnapshot.id,
        playerId: activePlayerId,
        startingScore,
        throws: data.throws,
        isBust: data.isBust,
        ...mutations,
      },
      ...optimistic((current) =>
        withTurnActionApplied(
          current,
          { legId: legSnapshot.id, ...mutations },
          optimisticTurn,
        ),
      ),
    })

    if (diff?.turnId && cachedGame.value) {
      cachedGame.value = mergeTurnDiff(cachedGame.value, diff)
      refreshStats()
    }
  }

  async function setStartingPlayer(playerId: string) {
    await updateGame({ activePlayerId: playerId, startPlayerId: playerId })
  }

  async function undoLastTurn() {
    if (!game.value || !currentLeg.value) return

    const allTurns = currentLeg.value.turns
    if (allTurns.length === 0) return

    const lastTurn = allTurns.at(-1)
    if (!lastTurn) return

    const updatedGame = await $fetch<GameFull>(
      `/api/games/${gameId.value}/turns/${lastTurn.id}`,
      {
        method: 'DELETE' as const,
        body: { activePlayerId: lastTurn.playerId },
        ...optimistic((current) => ({
          ...withTurnRemoved(current, lastTurn.id),
          activePlayerId: lastTurn.playerId,
        })),
      },
    )

    if (updatedGame && 'id' in updatedGame) {
      cachedGame.value = updatedGame
      refreshStats()
    }
  }

  async function resetGame() {
    if (!game.value) return

    const updatedGame = await $fetch<GameFull>(
      `/api/games/${gameId.value}/reset`,
      { method: 'POST' as const },
    )

    if (updatedGame && 'id' in updatedGame) {
      cachedGame.value = updatedGame
      refreshStats()
    }
  }

  async function endGameEarly() {
    if (!game.value) return

    let winnerId: string | null = null
    let maxSetsWon = -1
    let maxLegsWon = -1

    for (const player of game.value.players) {
      const setsWon = game.value.sets.filter(
        (set) => set.winnerId === player.playerId,
      ).length

      const legsWon = game.value.sets.reduce((total, set) => {
        const playerLegs = set.legs.filter(
          (leg) => leg.winnerId === player.playerId,
        ).length
        return total + playerLegs
      }, 0)

      if (
        setsWon > maxSetsWon ||
        (setsWon === maxSetsWon && legsWon > maxLegsWon)
      ) {
        maxSetsWon = setsWon
        maxLegsWon = legsWon
        winnerId = player.playerId
      }
    }

    await updateGame({
      winnerId,
      completedAt: new Date(),
      endReason: 'MANUAL',
    })
  }

  return {
    game,
    players,
    activePlayerStats,
    isMatchOver,
    currentSet,
    currentLeg,
    pending,
    error,
    refresh,
    updateGame,
    setStartingPlayer,
    submitTurn,
    undoLastTurn,
    resetGame,
    endGameEarly,
  }
}
