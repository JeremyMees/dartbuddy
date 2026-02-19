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
        include: {
          player: true,
        },
      },
      sets: {
        include: {
          winner: true,
          legs: {
            include: {
              winner: true,
              turns: {
                include: {
                  throws: true,
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
