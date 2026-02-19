import type { PlayerStats } from '~/types/player'

export function calculatePlayerStats(
  game: GameFull,
  player: GameFull['players'][number],
): PlayerStats {
  const playerTurns = game.sets.flatMap((set) =>
    set.legs.flatMap((leg) =>
      leg.turns.filter((turn) => turn.playerId === player.playerId),
    ),
  )

  const legsWon = game.sets
    .flatMap((set) => set.legs)
    .filter((leg) => leg.winnerId === player.playerId).length

  const lastTurn = playerTurns.length > 0 ? playerTurns.at(-1) : null
  const currentPoints = lastTurn?.remainingScore ?? game.startScore

  const totalThrows = playerTurns.reduce(
    (sum, turn) => sum + turn.throws.length,
    0,
  )

  const totalScored = playerTurns.reduce(
    (sum, turn) => sum + turn.totalScored,
    0,
  )

  const average = totalThrows > 0 ? (totalScored / totalThrows) * 3 : 0

  return {
    playerId: player.playerId,
    firstName: player.player.firstName,
    lastName: player.player.lastName,
    nickName: player.player.nickName,
    sets: player.setsWon,
    legs: legsWon,
    points: currentPoints,
    thrown: totalThrows,
    average: Math.round(average * 100) / 100,
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
