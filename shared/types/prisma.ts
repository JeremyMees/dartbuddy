import type { Prisma } from '#server/generated/prisma/client'

export type {
  AroundTheClockGame,
  SinglesTrainingGame,
  DoublesTrainingGame,
  ScoreTrainingGame,
} from '#server/generated/prisma/client'

export type CreateAroundTheClockGame = Prisma.AroundTheClockGameCreateInput
export type UpdateAroundTheClockGame = Prisma.AroundTheClockGameUpdateInput
export type CreateSinglesTrainingGame = Prisma.SinglesTrainingGameCreateInput
export type UpdateSinglesTrainingGame = Prisma.SinglesTrainingGameUpdateInput
export type CreateDoublesTrainingGame = Prisma.DoublesTrainingGameCreateInput
export type UpdateDoublesTrainingGame = Prisma.DoublesTrainingGameUpdateInput
export type CreateScoreTrainingGame = Prisma.ScoreTrainingGameCreateInput
export type UpdateScoreTrainingGame = Prisma.ScoreTrainingGameUpdateInput
