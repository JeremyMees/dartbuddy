import { z } from 'zod'

export const createDoublesTrainingGameSchema = z.object({
  hitPercent: z
    .number()
    .min(0, 'Hit percent must be at least 0')
    .max(100, 'Hit percent must be at most 100'),
})

export const updateDoublesTrainingGameSchema =
  createDoublesTrainingGameSchema.partial()
