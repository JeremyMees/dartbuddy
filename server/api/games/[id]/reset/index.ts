export default defineEventHandler(async (event) => {
  const gameId = getRouterParam(event, 'id')

  if (!gameId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game ID is required',
    })
  }

  const gameWithPlayers = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: {
        orderBy: { seatOrder: 'asc' },
      },
    },
  })

  if (!gameWithPlayers) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Game not found',
    })
  }

  const firstPlayer = gameWithPlayers.players[0]
  if (!firstPlayer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game has no players',
    })
  }

  await prisma.set.deleteMany({
    where: { gameId },
  })

  const game = await prisma.game.update({
    where: { id: gameId },
    data: {
      completedAt: null,
      endReason: null,
      winnerId: null,
      activePlayerId: firstPlayer.playerId,
      sets: {
        create: {
          number: 1,
          legs: {
            create: {
              number: 1,
            },
          },
        },
      },
    },
    include: {
      players: {
        orderBy: { seatOrder: 'asc' },
        include: {
          player: true,
        },
      },
      sets: {
        orderBy: { number: 'asc' },
        include: {
          winner: true,
          legs: {
            orderBy: { number: 'asc' },
            include: {
              winner: true,
              turns: {
                orderBy: { startedAt: 'asc' },
                include: {
                  throws: {
                    orderBy: { order: 'asc' },
                  },
                  player: true,
                },
              },
            },
          },
        },
      },
      winner: true,
      activePlayer: true,
    },
  })

  return game
})
