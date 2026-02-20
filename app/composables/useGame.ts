export function useGame() {
  const route = useRoute()
  const gameId = computed(() => route.params.id as string)
  const cacheKey = `game-${gameId.value}`

  const { data: cachedGame } = useNuxtData<GameFull>(cacheKey)

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
      calculatePlayerStats(game.value!, player),
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

  async function updateGame(
    updates: Partial<
      Pick<
        GameFull,
        'activePlayerId' | 'winnerId' | 'completedAt' | 'endReason'
      >
    >,
  ) {
    if (!cachedGame.value) return

    await $fetch(`/api/games/${gameId.value}`, {
      method: 'PATCH',
      body: updates,
      ...optimistic((current) => {
        const merged = { ...current, ...updates }

        if (updates.activePlayerId) {
          merged.activePlayer = findPlayer(current, updates.activePlayerId)
        }

        if (updates.winnerId) {
          merged.winner = findPlayer(current, updates.winnerId)
        } else if (updates.winnerId === null) {
          merged.winner = null
        }

        return merged as GameFull
      }),
    })
  }

  async function addTurn(data: {
    legId: string
    playerId: string
    startingScore: number
    throws: Array<{ segment: string; scored: number }>
    isBust?: boolean
  }) {
    if (!cachedGame.value) return

    const player = findPlayer(cachedGame.value, data.playerId)
    if (!player) return

    const totalScored = data.throws.reduce((sum, t) => sum + t.scored, 0)
    const tempId = `temp-${Date.now()}`

    const optimisticTurn: GameTurn = {
      id: tempId,
      legId: data.legId,
      playerId: data.playerId,
      startedAt: new Date(),
      startingScore: data.startingScore,
      totalScored,
      remainingScore: data.isBust
        ? data.startingScore
        : data.startingScore - totalScored,
      isBust: data.isBust ?? false,
      throws: data.throws.map((t, i) => ({
        id: `temp-throw-${Date.now()}-${i}`,
        turnId: tempId,
        playerId: data.playerId,
        order: i + 1,
        segment: t.segment,
        scored: t.scored,
      })),
      player,
    }

    await $fetch(`/api/games/${gameId.value}/turns`, {
      method: 'POST',
      body: data,
      ...optimistic((current) =>
        withTurnAdded(current, data.legId, optimisticTurn),
      ),
    })
  }

  async function addLeg(data: { setId: string; number: number }) {
    if (!cachedGame.value) return

    const optimisticLeg: GameLeg = {
      id: `temp-leg-${Date.now()}`,
      setId: data.setId,
      number: data.number,
      createdAt: new Date(),
      endedAt: null,
      winnerId: null,
      winner: null,
      turns: [],
    }

    await $fetch(`/api/games/${gameId.value}/legs`, {
      method: 'POST',
      body: data,
      ...optimistic((current) =>
        withLegAdded(current, data.setId, optimisticLeg),
      ),
    })
  }

  async function updateLeg(
    legId: string,
    updates: { winnerId?: string; endedAt?: Date | null },
  ) {
    if (!cachedGame.value) return

    const legUpdates: Partial<GameLeg> = { ...updates }
    if (updates.winnerId) {
      legUpdates.winner = findPlayer(cachedGame.value, updates.winnerId)
    }

    await $fetch(`/api/games/${gameId.value}/legs/${legId}`, {
      method: 'PATCH',
      body: updates,
      ...optimistic((current) => withLegUpdated(current, legId, legUpdates)),
    })
  }

  async function addSet(data: { number: number }) {
    if (!cachedGame.value) return

    const tempSetId = `temp-set-${Date.now()}`

    const optimisticSet: GameSet = {
      id: tempSetId,
      gameId: gameId.value,
      number: data.number,
      createdAt: new Date(),
      endedAt: null,
      winnerId: null,
      winner: null,
      legs: [
        {
          id: `temp-leg-${Date.now()}`,
          setId: tempSetId,
          number: 1,
          createdAt: new Date(),
          endedAt: null,
          winnerId: null,
          winner: null,
          turns: [],
        },
      ],
    }

    await $fetch(`/api/games/${gameId.value}/sets`, {
      method: 'POST',
      body: data,
      ...optimistic((current) => withSetAdded(current, optimisticSet)),
    })
  }

  async function updateSet(
    setId: string,
    updates: { winnerId?: string; endedAt?: Date | null },
  ) {
    if (!cachedGame.value) return

    const setUpdates: Partial<GameSet> = { ...updates }
    if (updates.winnerId) {
      setUpdates.winner = findPlayer(cachedGame.value, updates.winnerId)
    }

    await $fetch(`/api/games/${gameId.value}/sets/${setId}`, {
      method: 'PATCH',
      body: updates,
      ...optimistic((current) => withSetUpdated(current, setId, setUpdates)),
    })
  }

  async function setNextPlayer() {
    if (!game.value) return

    const nextPlayerId = getNextPlayerId(game.value)
    if (!nextPlayerId) return

    await updateGame({ activePlayerId: nextPlayerId })
  }

  async function handleWinningThrow() {
    if (!game.value || !currentSet.value || !currentLeg.value) {
      return
    }

    const activePlayerId = game.value.activePlayerId
    const gameSnapshot = game.value
    const currentSetSnapshot = currentSet.value
    const currentLegSnapshot = currentLeg.value

    await updateLeg(currentLegSnapshot.id, {
      winnerId: activePlayerId,
      endedAt: new Date(),
    })

    const legsWonInSet =
      currentSetSnapshot.legs.filter((leg) => leg.winnerId === activePlayerId)
        .length + 1

    if (legsWonInSet >= gameSnapshot.legsToWin) {
      await updateSet(currentSetSnapshot.id, {
        winnerId: activePlayerId,
        endedAt: new Date(),
      })

      const setsWon =
        gameSnapshot.sets.filter((set) => set.winnerId === activePlayerId)
          .length + 1

      if (setsWon >= gameSnapshot.setsToWin) {
        await updateGame({
          winnerId: activePlayerId,
          completedAt: new Date(),
          endReason: 'COMPLETED',
        })
        return
      }

      await addSet({ number: gameSnapshot.sets.length + 1 })
    } else {
      await addLeg({
        setId: currentSetSnapshot.id,
        number: currentSetSnapshot.legs.length + 1,
      })
    }

    const playerIds = gameSnapshot.players.map((p) => p.playerId)
    const nextStarterId =
      playerIds.length > 1
        ? (playerIds.find((id) => id !== activePlayerId) ?? activePlayerId)
        : activePlayerId

    await updateGame({ activePlayerId: nextStarterId })
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
    handleWinningThrow,
    addTurn,
    setNextPlayer,
  }
}
