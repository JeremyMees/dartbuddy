export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  const game = await prisma.game.delete({
    where: {
      id,
    },
  })

  return game
})
