import { z } from 'zod'

export const createAroundTheClockGameSchema = z.object({
  hitPercent: z
    .number()
    .min(0, 'Hit percent must be at least 0')
    .max(100, 'Hit percent must be at most 100'),
  dartsThrown: z
    .number()
    .min(1, 'Darts thrown must be at least 1')
    .max(200, 'Darts thrown must be less than 200'),
})

export const updateAroundTheClockGameSchema =
  createAroundTheClockGameSchema.partial()
