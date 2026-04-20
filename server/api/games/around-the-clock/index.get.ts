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

  const games = await prisma.aroundTheClockGame.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      hitPercent: true,
      dartsThrown: true,
    },
  })

  const bestGame = getBestGame(games, 'hitPercent')
  const lastGame = games.length > 0 ? games[games.length - 1] : null

  return {
    totalGames: games.length,
    averageHitPercent: {
      percent: getAverage(games, 'hitPercent'),
      trend: getTrendDirection(games, 'hitPercent'),
    },
    dartsThrown: games.reduce((total, game) => total + game.dartsThrown, 0),
    bestGame,
    lastGame,
    scoreDistribution: getScoreDistribution(games, 'hitPercent'),
    scoreTrend: getScoreAverageByDate(games, 'hitPercent'),
    recentGames: games.slice(0, 5),
  }
})
