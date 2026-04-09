import { z } from 'zod'
import { gameRanges } from '#shared/constants/game'

const querySchema = z.object({
  range: z.enum(gameRanges),
})

export default defineEventHandler(async (event) => {
  const { success, data, error } = await getValidatedQuery(event, (queries) =>
    querySchema.safeParse(queries),
  )

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
      data: error.issues,
    })
  }

  const rangeStartDate = getRangeStartDate(data.range)

  const games = await prisma.singlesTrainingGame.findMany({
    orderBy: { createdAt: 'desc' },
    ...(rangeStartDate
      ? { where: generateRangeWhereClause(rangeStartDate) }
      : {}),
  })

  return {
    range: data.range,
    games,
  }
})
