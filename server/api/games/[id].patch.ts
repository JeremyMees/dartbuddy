import { z } from 'zod'

const querySchema = z.object({
  activePlayerId: z.string().optional(),
  startPlayerId: z.string().optional(),
  winnerId: z.string().optional(),
  completedAt: z.string().optional(),
  endReason: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (queries) =>
    querySchema.parse(queries),
  )

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  const updateData = removeEmptyValues(data)

  const game = await prisma.game.update({
    where: { id },
    data: updateData,
    include: gameActiveInclude,
  })

  return game
})
