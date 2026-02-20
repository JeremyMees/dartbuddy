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
