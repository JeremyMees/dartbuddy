import { z } from 'zod'

const querySchema = z.object({
  winnerId: z.string().optional(),
  endedAt: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (queries) =>
    querySchema.safeParse(queries),
  )

  if (!success) throw error.issues

  const gameId = getRouterParam(event, 'id')
  const legId = getRouterParam(event, 'legId')

  if (!gameId || !legId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game ID and Leg ID are required',
    })
  }

  const updateData = removeEmptyValues(data)

  await prisma.leg.update({
    where: { id: legId },
    data: updateData,
  })

  const game = await $fetch(`/api/games/${gameId}`)

  return game
})
