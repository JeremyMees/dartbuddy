export default defineEventHandler(async (event) => {
  const gameId = getRouterParam(event, 'id')

  if (!gameId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  const [gameData, turns] = await Promise.all([
    prisma.game.findUnique({
      where: { id: gameId },
      select: {
        players: {
          orderBy: { seatOrder: 'asc' as const },
          select: { playerId: true },
        },
        sets: {
          select: {
            winnerId: true,
            legs: {
              select: { winnerId: true, setId: true },
            },
          },
        },
      },
    }),
    prisma.turn.findMany({
      where: { leg: { set: { gameId } } },
      select: {
        playerId: true,
        totalScored: true,
        isBust: true,
        startingScore: true,
        remainingScore: true,
        _count: { select: { throws: true } },
      },
    }),
  ])

  if (!gameData) return []

  return gameData.players.map(({ playerId }) => {
    const playerTurns = turns.filter((t) => t.playerId === playerId)
    const nonBustTurns = playerTurns.filter((t) => !t.isBust)
    const checkoutTurns = playerTurns.filter(
      (t) => t.remainingScore === 0 && !t.isBust,
    )
    const totalThrows = playerTurns.reduce((sum, t) => sum + t._count.throws, 0)
    const totalScored = playerTurns.reduce((sum, t) => sum + t.totalScored, 0)

    const currentSetLegs = gameData.sets.at(-1)?.legs ?? []
    const allLegs = gameData.sets.flatMap((s) => s.legs)

    return {
      playerId,
      sets: gameData.sets.filter((s) => s.winnerId === playerId).length,
      legs: currentSetLegs.filter((l) => l.winnerId === playerId).length,
      totalLegsWon: allLegs.filter((l) => l.winnerId === playerId).length,
      average: totalThrows
        ? Math.round(((totalScored / totalThrows) * 3 * 100) / 100)
        : 0,
      highestTurn: nonBustTurns.length
        ? Math.max(...nonBustTurns.map((t) => t.totalScored))
        : 0,
      oneEighties: playerTurns.filter((t) => t.totalScored === 180).length,
      checkoutAttempts: playerTurns.filter((t) => t.startingScore <= 170)
        .length,
      checkoutSuccesses: checkoutTurns.length,
      highestCheckout: checkoutTurns.length
        ? Math.max(...checkoutTurns.map((t) => t.startingScore))
        : 0,
      busts: playerTurns.filter((t) => t.isBust).length,
    }
  })
})
