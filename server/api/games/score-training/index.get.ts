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

  const games = await prisma.scoreTrainingGame.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      totalScore: true,
      highestScore: true,
      threeDartAverage: true,
      oneEightyCount: true,
    },
  })

  return {
    totalGames: games.length,
    averageScore: {
      percent: getAverage(games, 'totalScore'),
      trend: getTrendDirection(games, 'totalScore'),
    },
    bestGame: getBestGame(games, 'totalScore'),
    bestThreeDarts: getHighest(games, 'threeDartAverage'),
    thrownOneEighties: games.reduce(
      (count, game) => count + game.oneEightyCount,
      0,
    ),
    highestThrow: getHighest(games, 'highestScore'),
    averageHighestThrow: getAverage(games, 'highestScore'),
    scoreTrend: getScoreAverageByDate(games, 'totalScore'),
    recentGames: games.slice(0, 5),
  }
})
