export function isBust(
  outType: OutType,
  remaining: number,
  lastSegment: Segment | undefined,
): boolean {
  if (!outType || remaining < 0) return true

  if (remaining === 1 && outType !== 'STRAIGHT') return true

  if (remaining === 0 && lastSegment) {
    if (outType === 'DOUBLE') {
      return !lastSegment.startsWith('D')
    }
    if (outType === 'MASTER') {
      return !lastSegment.startsWith('D') && !lastSegment.startsWith('T')
    }
  }

  return false
}

export function calculateSetsWon(game: GameFull, playerId: string): number {
  return game.sets.filter((set) => set.winnerId === playerId).length
}

export function calculateLegsWon(game: GameFull, playerId: string) {
  const currentSetLegs = game.sets.at(-1)?.legs ?? []
  const legs = currentSetLegs.filter((leg) => leg.winnerId === playerId).length
  const totalLegsWon = game.sets
    .flatMap((set) => set.legs)
    .filter((leg) => leg.winnerId === playerId).length
  return { legs, totalLegsWon }
}

export function calculateCurrentPoints(
  game: GameFull,
  currentLegTurns: GameTurn[],
): number {
  return currentLegTurns.at(-1)?.remainingScore ?? game.startScore
}

export function calculateThreeDartAverage(turns: GameTurn[]): number {
  const totalScored = turns.reduce((sum, t) => sum + t.totalScored, 0)
  const totalThrows = turns.reduce((sum, t) => sum + t.throws.length, 0)

  if (!totalThrows) return 0

  return Math.round(((totalScored / totalThrows) * 3 * 100) / 100)
}

export function calculateTurnStats(turns: GameTurn[]) {
  const nonBustTurns = turns.filter((t) => !t.isBust)
  const checkoutTurns = turns.filter((t) => t.remainingScore === 0 && !t.isBust)

  return {
    highestTurn: nonBustTurns.length
      ? Math.max(...nonBustTurns.map((t) => t.totalScored))
      : 0,
    oneEighties: turns.filter((t) => t.totalScored === 180).length,
    checkoutAttempts: turns.filter((t) => t.startingScore <= 170).length,
    checkoutSuccesses: checkoutTurns.length,
    highestCheckout: checkoutTurns.length
      ? Math.max(...checkoutTurns.map((t) => t.startingScore))
      : 0,
    busts: turns.filter((t) => t.isBust).length,
  }
}
