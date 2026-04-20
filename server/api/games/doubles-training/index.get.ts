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
  const where = rangeStartDate
    ? generateRangeWhereClause(rangeStartDate)
    : undefined

  const [
    aggregate,
    bestGame,
    scoreDistribution,
    scoreTrend,
    trend,
    recentGames,
  ] = await Promise.all([
    prisma.doublesTrainingGame.aggregate({
      where,
      _avg: {
        hitPercent: true,
      },
      _count: {
        _all: true,
      },
    }),
    prisma.doublesTrainingGame.findFirst({
      where,
      orderBy: [{ hitPercent: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        createdAt: true,
        hitPercent: true,
      },
    }),
    getScoreDistributionForColumn(
      'DoublesTrainingGame',
      'hitPercent',
      rangeStartDate,
    ),
    getScoreAverageByDateForColumn(
      'DoublesTrainingGame',
      'hitPercent',
      rangeStartDate,
    ),
    getTrendDirectionForColumn(
      'DoublesTrainingGame',
      'hitPercent',
      rangeStartDate,
    ),
    prisma.doublesTrainingGame.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        hitPercent: true,
      },
    }),
  ])

  return {
    totalGames: aggregate._count._all,
    averageScore: {
      percent: Math.round(aggregate._avg.hitPercent ?? 0),
      trend,
    },
    bestGame,
    scoreDistribution,
    scoreTrend,
    recentGames,
  }
})
