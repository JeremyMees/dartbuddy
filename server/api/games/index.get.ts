import { z } from 'zod'
import { gameTypes, gameRanges } from '#shared/constants/game'
import type {
  GameFindManyOptions,
  GameResponse,
  GameResultsByType,
  GameType,
} from '#shared/types'

const gameQueries = {
  aroundTheClock: (options: GameFindManyOptions) =>
    prisma.aroundTheClockGame.findMany(options),
  singlesTraining: (options: GameFindManyOptions) =>
    prisma.singlesTrainingGame.findMany(options),
  doublesTraining: (options: GameFindManyOptions) =>
    prisma.doublesTrainingGame.findMany(options),
  scoreTraining: (options: GameFindManyOptions) =>
    prisma.scoreTrainingGame.findMany(options),
} satisfies {
  [K in GameType]: (
    options: GameFindManyOptions,
  ) => Promise<GameResultsByType[K]>
}

const querySchema = z.object({
  type: z.enum(gameTypes),
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

  const options: GameFindManyOptions = {
    orderBy: { createdAt: 'desc' },
    ...(rangeStartDate
      ? {
          where: {
            createdAt: { gte: rangeStartDate },
          },
        }
      : {}),
  }

  const games = await gameQueries[data.type](options)

  return {
    type: data.type,
    range: data.range,
    games,
  } as GameResponse
})
