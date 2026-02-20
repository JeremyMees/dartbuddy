export default defineEventHandler(async (event) => {
  const gameId = getRouterParam(event, 'id')
  const turnId = getRouterParam(event, 'turnId')

  if (!gameId || !turnId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game ID and Turn ID are required',
    })
  }

  const turn = await prisma.turn.findFirst({
    where: {
      id: turnId,
      leg: {
        set: {
          gameId,
        },
      },
    },
  })

  if (!turn) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Turn not found in this game',
    })
  }

  await prisma.turn.delete({
    where: {
      id: turnId,
    },
  })

  return { success: true }
})
