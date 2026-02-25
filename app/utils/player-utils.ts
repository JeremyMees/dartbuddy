export function findPlayer(game: GameFull, playerId: string) {
  return game.players.find((p) => p.playerId === playerId)?.player ?? null
}

export function getPlayerCurrentLegTurns(
  game: GameFull,
  playerId: string,
): GameTurn[] {
  const currentLeg = game.sets.at(-1)?.legs.at(-1)

  return currentLeg?.turns.filter((turn) => turn.playerId === playerId) ?? []
}

export function calculatePlayerStats(
  game: GameFull,
  player: GameFull['players'][number],
  aggregatedStats: PlayerAggregatedStats[] = [],
): PlayerStats {
  const { playerId } = player
  const currentLegTurns = getPlayerCurrentLegTurns(game, playerId)

  const agg = aggregatedStats.find((s) => s.playerId === playerId) ?? {
    sets: 0,
    legs: 0,
    totalLegsWon: 0,
    average: 0,
    highestTurn: 0,
    oneEighties: 0,
    checkoutAttempts: 0,
    checkoutSuccesses: 0,
    highestCheckout: 0,
    busts: 0,
  }

  return {
    playerId,
    firstName: player.player.firstName,
    lastName: player.player.lastName,
    nickName: player.player.nickName,
    sets: agg.sets,
    legs: agg.legs,
    totalLegsWon: agg.totalLegsWon,
    points: calculateCurrentPoints(currentLegTurns, game.startScore),
    thrown: currentLegTurns.reduce((sum, t) => sum + t._count.throws, 0),
    average: agg.average,
    highestTurn: agg.highestTurn,
    oneEighties: agg.oneEighties,
    checkoutAttempts: agg.checkoutAttempts,
    checkoutSuccesses: agg.checkoutSuccesses,
    highestCheckout: agg.highestCheckout,
    busts: agg.busts,
  }
}

export function getPlayerWithLeastThrows(
  stats: PlayerStats[],
): string | undefined {
  if (!stats.length) return undefined

  return stats.reduce((minPlayer, currentPlayer) => {
    return currentPlayer.thrown < minPlayer.thrown ? currentPlayer : minPlayer
  }).playerId
}

export function getNextPlayerId(
  game: GameFull,
  activePlayerId?: string,
): string | undefined {
  const currentPlayerId = activePlayerId ?? game.activePlayerId
  const playerIds = game.players.map((p) => p.playerId)
  const currentIndex = playerIds.indexOf(currentPlayerId)

  if (currentIndex === -1) return currentPlayerId

  const nextIndex = (currentIndex + 1) % playerIds.length
  return playerIds[nextIndex]
}
