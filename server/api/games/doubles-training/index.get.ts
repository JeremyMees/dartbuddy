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

  const games = await prisma.doublesTrainingGame.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      hitPercent: true,
    },
  })

  return {
    totalGames: games.length,
    averageScore: {
      percent: getAverage(games, 'hitPercent'),
      trend: getTrendDirection(games, 'hitPercent'),
    },
    bestGame: getBestGame(games, 'hitPercent'),
    scoreDistribution: getScoreDistribution(games, 'hitPercent'),
    scoreTrend: getScoreAverageByDate(games, 'hitPercent'),
    recentGames: games.slice(0, 5),
  }
})
