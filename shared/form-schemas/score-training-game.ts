import { z } from 'zod'

export const createScoreTrainingGameSchema = z.object({
  totalScore: z
    .number()
    .min(0, 'Total score must be at least 0')
    .max(1800, 'Total score must be at most 1800'),
  highestScore: z
    .number()
    .min(0, 'Highest score must be at least 0')
    .max(180, 'Highest score must be at most 180'),
  oneEightyCount: z
    .number()
    .min(0, '180s count must be at least 0')
    .max(10, '180s count must be at most 10'),
  threeDartAverage: z
    .number()
    .min(0, 'Three dart average must be at least 0')
    .max(180, 'Three dart average must be at most 180'),
  oneDartAverage: z
    .number()
    .min(0, 'One dart average must be at least 0')
    .max(60, 'One dart average must be at most 60'),
})

export const updateScoreTrainingGameSchema =
  createScoreTrainingGameSchema.partial()
