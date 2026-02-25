import { z } from 'zod'

const bodySchema = z.object({
  activePlayerId: z.string(),
})

export default defineEventHandler(async (event) => {
  const gameId = getRouterParam(event, 'id')
  const turnId = getRouterParam(event, 'turnId')

  if (!gameId || !turnId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game ID and Turn ID are required',
    })
  }

  const { success, data, error } = await readValidatedBody(event, (body) =>
    bodySchema.safeParse(body),
  )

  if (!success) throw error.issues

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

  const game = await prisma.$transaction(async (tx) => {
    await tx.turn.delete({
      where: {
        id: turnId,
      },
    })

    await tx.game.update({
      where: {
        id: gameId,
      },
      data: {
        activePlayerId: data.activePlayerId,
      },
    })

    return tx.game.findUniqueOrThrow({
      where: {
        id: gameId,
      },
      include: gameActiveInclude,
    })
  })

  return game
})
