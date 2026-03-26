import { z } from 'zod'

export const createSinglesTrainingGameSchema = z.object({
  score: z
    .number()
    .min(0, 'Score must be at least 0')
    .max(100, 'Score must be at most 100'),
})

export const updateSinglesTrainingGameSchema =
  createSinglesTrainingGameSchema.partial()
