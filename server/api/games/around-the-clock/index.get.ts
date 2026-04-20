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
    lastGame,
    scoreDistribution,
    scoreTrend,
    trend,
    recentGames,
  ] = await Promise.all([
    prisma.aroundTheClockGame.aggregate({
      where,
      _avg: {
        hitPercent: true,
      },
      _sum: {
        dartsThrown: true,
      },
      _count: {
        _all: true,
      },
    }),
    prisma.aroundTheClockGame.findFirst({
      where,
      orderBy: [{ hitPercent: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        createdAt: true,
        hitPercent: true,
        dartsThrown: true,
      },
    }),
    prisma.aroundTheClockGame.findFirst({
      where,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        createdAt: true,
        hitPercent: true,
        dartsThrown: true,
      },
    }),
    getScoreDistributionForColumn(
      'AroundTheClockGame',
      'hitPercent',
      rangeStartDate,
    ),
    getScoreAverageByDateForColumn(
      'AroundTheClockGame',
      'hitPercent',
      rangeStartDate,
    ),
    getTrendDirectionForColumn(
      'AroundTheClockGame',
      'hitPercent',
      rangeStartDate,
    ),
    prisma.aroundTheClockGame.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        hitPercent: true,
        dartsThrown: true,
      },
    }),
  ])

  return {
    totalGames: aggregate._count._all,
    averageHitPercent: {
      percent: Math.round(aggregate._avg.hitPercent ?? 0),
      trend,
    },
    dartsThrown: aggregate._sum.dartsThrown ?? 0,
    bestGame,
    lastGame,
    scoreDistribution,
    scoreTrend,
    recentGames,
  }
})
