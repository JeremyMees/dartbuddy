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
  const setId = getRouterParam(event, 'setId')

  if (!gameId || !setId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game ID and Set ID are required',
    })
  }

  const updateData = removeEmptyValues(data)

  const set = await prisma.set.update({
    where: { id: setId },
    data: updateData,
  })

  return set
})
