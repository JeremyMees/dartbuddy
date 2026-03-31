import type { Prisma } from '#server/generated/prisma/client'

export type GameRange = 'allTime' | 'lastMonth' | 'lastWeek' | 'today'

export type GameType =
  | 'aroundTheClock'
  | 'singlesTraining'
  | 'doublesTraining'
  | 'scoreTraining'

export type GameFindManyOptions =
  NonNullable<Prisma.AroundTheClockGameFindManyArgs> &
    NonNullable<Prisma.SinglesTrainingGameFindManyArgs> &
    NonNullable<Prisma.DoublesTrainingGameFindManyArgs> &
    NonNullable<Prisma.ScoreTrainingGameFindManyArgs>

export type GameResultsByType = {
  aroundTheClock: Awaited<
    ReturnType<Prisma.AroundTheClockGameDelegate['findMany']>
  >
  singlesTraining: Awaited<
    ReturnType<Prisma.SinglesTrainingGameDelegate['findMany']>
  >
  doublesTraining: Awaited<
    ReturnType<Prisma.DoublesTrainingGameDelegate['findMany']>
  >
  scoreTraining: Awaited<
    ReturnType<Prisma.ScoreTrainingGameDelegate['findMany']>
  >
}

export type GameResponse = {
  [K in GameType]: { type: K; range: GameRange; games: GameResultsByType[K] }
}[GameType]

export interface GameData<T> {
  type: GameType
  range: GameRange
  games: T[]
}
