export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  const game = await prisma.game.findUnique({
    where: {
      id,
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

  if (!game) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Game not found',
    })
  }

  return game
})
