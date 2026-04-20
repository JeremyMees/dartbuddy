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
    prisma.singlesTrainingGame.aggregate({
      where,
      _avg: {
        score: true,
      },
      _count: {
        _all: true,
      },
    }),
    prisma.singlesTrainingGame.findFirst({
      where,
      orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        createdAt: true,
        score: true,
      },
    }),
    getScoreDistributionForColumn(
      'SinglesTrainingGame',
      'score',
      rangeStartDate,
    ),
    getScoreAverageByDateForColumn(
      'SinglesTrainingGame',
      'score',
      rangeStartDate,
    ),
    getTrendDirectionForColumn('SinglesTrainingGame', 'score', rangeStartDate),
    prisma.singlesTrainingGame.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        score: true,
      },
    }),
  ])

  return {
    totalGames: aggregate._count._all,
    averageScore: {
      percent: Math.round(aggregate._avg.score ?? 0),
      trend,
    },
    bestGame,
    scoreDistribution,
    scoreTrend,
    recentGames,
  }
})
