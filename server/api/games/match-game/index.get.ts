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

  const [aggregate, chartGames, recentGames, groupedResults] =
    await Promise.all([
      prisma.matchGame.aggregate({
        where,
        _avg: {
          threeDartAverage: true,
          firstNineDartAverage: true,
        },
        _max: {
          highestFinish: true,
          highestScore: true,
        },
        _sum: {
          checkoutHits: true,
          checkoutThrown: true,
        },
        _count: {
          _all: true,
        },
      }),
      prisma.matchGame.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          threeDartAverage: true,
          firstNineDartAverage: true,
        },
      }),
      prisma.matchGame.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          createdAt: true,
          hasWon: true,
          opponent: true,
          threeDartAverage: true,
          checkoutHits: true,
          checkoutThrown: true,
        },
      }),
      prisma.matchGame.groupBy({
        where,
        by: ['opponent', 'hasWon'],
        _count: {
          _all: true,
        },
      }),
    ])

  const totalGames = aggregate._count._all
  const wins = groupedResults.reduce(
    (total, result) => total + (result.hasWon ? result._count._all : 0),
    0,
  )
  const checkoutHits = aggregate._sum.checkoutHits ?? 0
  const checkoutThrown = aggregate._sum.checkoutThrown ?? 0

  return {
    totalGames,
    winRate: getRatioPercentage(wins, totalGames),
    checkoutStats: {
      hits: checkoutHits,
      thrown: checkoutThrown,
      percent: getRatioPercentage(checkoutHits, checkoutThrown),
    },
    threeDartsAverage: Math.round(aggregate._avg.threeDartAverage ?? 0),
    firstNineDartAverage: Math.round(aggregate._avg.firstNineDartAverage ?? 0),
    highestFinish: aggregate._max.highestFinish ?? 0,
    highestScore: aggregate._max.highestScore ?? 0,
    scoreTrend: getMatchScoreTrend(chartGames),
    winLossDistribution: getWinLossDistribution(groupedResults),
    recentGames: recentGames.map((game) => ({
      ...game,
      checkoutPercentage: getRatioPercentage(
        game.checkoutHits,
        game.checkoutThrown,
      ),
    })),
  }
})
