export function findPlayer(game: GameFull, playerId: string) {
  return game.players.find((p) => p.playerId === playerId)?.player ?? null
}

export function getPlayerTurns(game: GameFull, playerId: string): GameTurn[] {
  return game.sets.flatMap((set) =>
    set.legs.flatMap((leg) =>
      leg.turns.filter((turn) => turn.playerId === playerId),
    ),
  )
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
): PlayerStats {
  const { playerId } = player
  const allTurns = getPlayerTurns(game, playerId)
  const currentLegTurns = getPlayerCurrentLegTurns(game, playerId)
  const { legs, totalLegsWon } = calculateLegsWon(game, playerId)

  return {
    playerId,
    firstName: player.player.firstName,
    lastName: player.player.lastName,
    nickName: player.player.nickName,
    sets: calculateSetsWon(game, playerId),
    legs,
    totalLegsWon,
    points: calculateCurrentPoints(currentLegTurns, game.startScore),
    thrown: currentLegTurns.reduce((sum, t) => sum + t.throws.length, 0),
    average: calculateThreeDartAverage(allTurns),
    ...calculateTurnStats(allTurns),
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

export function getNextPlayerId(game: GameFull): string | undefined {
  const currentPlayerId = game.activePlayerId
  const playerIds = game.players.map((p) => p.playerId)
  const currentIndex = playerIds.indexOf(currentPlayerId)

  if (currentIndex === -1) return undefined

  const nextIndex = (currentIndex + 1) % playerIds.length
  return playerIds[nextIndex]
}
