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

  const [aggregate, bestGame, scoreTrend, trend, recentGames] =
    await Promise.all([
      prisma.scoreTrainingGame.aggregate({
        where,
        _avg: {
          totalScore: true,
          highestScore: true,
        },
        _sum: {
          oneEightyCount: true,
        },
        _max: {
          highestScore: true,
          threeDartAverage: true,
        },
        _count: {
          _all: true,
        },
      }),
      prisma.scoreTrainingGame.findFirst({
        where,
        orderBy: [{ totalScore: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          createdAt: true,
          totalScore: true,
          highestScore: true,
          threeDartAverage: true,
          oneEightyCount: true,
        },
      }),
      getScoreAverageByDateForColumn(
        'ScoreTrainingGame',
        'totalScore',
        rangeStartDate,
      ),
      getTrendDirectionForColumn(
        'ScoreTrainingGame',
        'totalScore',
        rangeStartDate,
      ),
      prisma.scoreTrainingGame.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          createdAt: true,
          totalScore: true,
          highestScore: true,
          threeDartAverage: true,
          oneEightyCount: true,
        },
      }),
    ])

  return {
    totalGames: aggregate._count._all,
    averageScore: {
      percent: Math.round(aggregate._avg.totalScore ?? 0),
      trend,
    },
    bestGame,
    bestThreeDarts: Math.round(aggregate._max.threeDartAverage ?? 0),
    thrownOneEighties: aggregate._sum.oneEightyCount ?? 0,
    highestThrow: aggregate._max.highestScore ?? 0,
    averageHighestThrow: Math.round(aggregate._avg.highestScore ?? 0),
    scoreTrend,
    recentGames,
  }
})
