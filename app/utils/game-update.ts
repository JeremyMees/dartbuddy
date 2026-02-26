export function withTurnActionApplied(
  game: GameFull,
  action: TurnActionState,
  optimisticTurn: GameTurn,
): GameFull {
  let updated = withTurnAdded(game, action.legId, optimisticTurn)

  if (action.legUpdate) {
    updated = withLegUpdated(updated, action.legUpdate.legId, {
      winnerId: action.legUpdate.winnerId,
      endedAt: new Date(action.legUpdate.endedAt),
    })
  }

  if (action.setUpdate) {
    updated = withSetUpdated(updated, action.setUpdate.setId, {
      winnerId: action.setUpdate.winnerId,
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
      legs: [
        {
          id: `temp-leg-${Date.now()}`,
          setId: tempSetId,
          number: 1,
          createdAt: new Date(),
          endedAt: null,
          winnerId: null,
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

export function mergeTurnDiff(game: GameFull, diff: TurnDiff): GameFull {
  let updated: GameFull = {
    ...game,
    sets: game.sets.map((set) => ({
      ...set,
      legs: set.legs.map((leg) => ({
        ...leg,
        turns: leg.turns.map((turn) =>
          turn.id.startsWith('temp-') ? { ...turn, id: diff.turnId } : turn,
        ),
      })),
    })),
  } as GameFull

  if (diff.newLegId) {
    updated = {
      ...updated,
      sets: updated.sets.map((set) => ({
        ...set,
        legs: set.legs.map((leg) =>
          leg.id.startsWith('temp-leg-') ? { ...leg, id: diff.newLegId! } : leg,
        ),
      })),
    } as GameFull
  }

  if (diff.newSetId) {
    updated = {
      ...updated,
      sets: updated.sets.map((set) =>
        set.id.startsWith('temp-set-')
          ? {
              ...set,
              id: diff.newSetId!,
              legs: set.legs.map((leg) =>
                leg.id.startsWith('temp-leg-')
                  ? {
                      ...leg,
                      id: diff.newSetLegId ?? leg.id,
                      setId: diff.newSetId!,
                    }
                  : leg,
              ),
            }
          : set,
      ),
    } as GameFull
  }

  return updated
}

export function withTurnAdded(
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

export function withLegAdded(
  game: GameFull,
  setId: string,
  leg: GameLeg,
): GameFull {
  return {
    ...game,
    sets: game.sets.map((set) =>
      set.id === setId ? { ...set, legs: [...set.legs, leg] } : set,
    ),
  } as GameFull
}

export function withLegUpdated(
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

export function withSetAdded(game: GameFull, set: GameSet): GameFull {
  return { ...game, sets: [...game.sets, set] } as GameFull
}

export function withSetUpdated(
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
