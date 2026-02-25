export function withTurnActionApplied(
  game: GameFull,
  action: TurnActionState,
  optimisticTurn: GameTurn,
): GameFull {
  let updated = withTurnAdded(game, action.legId, optimisticTurn)

  if (action.legUpdate) {
    updated = withLegUpdated(updated, action.legUpdate.legId, {
      winnerId: action.legUpdate.winnerId,
      winner: findPlayer(game, action.legUpdate.winnerId),
      endedAt: new Date(action.legUpdate.endedAt),
    })
  }

  if (action.setUpdate) {
    updated = withSetUpdated(updated, action.setUpdate.setId, {
      winnerId: action.setUpdate.winnerId,
      winner: findPlayer(game, action.setUpdate.winnerId),
      endedAt: new Date(action.setUpdate.endedAt),
    })
  }

  if (action.newLeg) {
    const optimisticLeg: GameLeg = {
      id: `temp-leg-${Date.now()}`,
      setId: action.newLeg.setId,
      number: action.newLeg.number,
      createdAt: new Date(),
      endedAt: null,
      winnerId: null,
      winner: null,
      turns: [],
    }
    updated = withLegAdded(updated, action.newLeg.setId, optimisticLeg)
  }

  if (action.newSet) {
    const tempSetId = `temp-set-${Date.now()}`
    const optimisticSet: GameSet = {
      id: tempSetId,
      gameId: game.id,
      number: action.newSet.number,
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
    updated = withSetAdded(updated, optimisticSet)
  }

  if (action.gameUpdate) {
    const { activePlayerId, winnerId, completedAt, endReason } =
      action.gameUpdate
    const patch: Partial<GameFull> = {}

    if (activePlayerId !== undefined) {
      patch.activePlayerId = activePlayerId
      patch.activePlayer = findPlayer(game, activePlayerId) ?? null
    }
    if (winnerId !== undefined) {
      patch.winnerId = winnerId
      patch.winner = winnerId ? findPlayer(game, winnerId) : null
    }
    if (completedAt !== undefined) {
      patch.completedAt = new Date(completedAt)
    }
    if (endReason !== undefined) {
      patch.endReason = endReason as GameFull['endReason']
    }

    updated = { ...updated, ...patch }
  }

  return updated
}

function withTurnAdded(
  game: GameFull,
  legId: string,
  turn: GameTurn,
): GameFull {
  return {
    ...game,
    sets: game.sets.map((set) => ({
      ...set,
      legs: set.legs.map((leg) =>
        leg.id === legId ? { ...leg, turns: [...leg.turns, turn] } : leg,
      ),
    })),
  } as GameFull
}

function withLegAdded(game: GameFull, setId: string, leg: GameLeg): GameFull {
  return {
    ...game,
    sets: game.sets.map((set) =>
      set.id === setId ? { ...set, legs: [...set.legs, leg] } : set,
    ),
  } as GameFull
}

function withLegUpdated(
  game: GameFull,
  legId: string,
  updates: Partial<GameLeg>,
): GameFull {
  return {
    ...game,
    sets: game.sets.map((set) => ({
      ...set,
      legs: set.legs.map((leg) =>
        leg.id === legId ? { ...leg, ...updates } : leg,
      ),
    })),
  } as GameFull
}

function withSetAdded(game: GameFull, set: GameSet): GameFull {
  return { ...game, sets: [...game.sets, set] } as GameFull
}

function withSetUpdated(
  game: GameFull,
  setId: string,
  updates: Partial<GameSet>,
): GameFull {
  return {
    ...game,
    sets: game.sets.map((set) =>
      set.id === setId ? { ...set, ...updates } : set,
    ),
  } as GameFull
}

export function withTurnRemoved(game: GameFull, turnId: string): GameFull {
  return {
    ...game,
    sets: game.sets.map((set) => ({
      ...set,
      legs: set.legs.map((leg) => ({
        ...leg,
        turns: leg.turns.filter((turn) => turn.id !== turnId),
      })),
    })),
  } as GameFull
}
