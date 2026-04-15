import { z } from 'zod'

export const createMatchGameSchema = z.object({
  hasWon: z.boolean(),
  opponent: z
    .string()
    .min(1, 'Opponent must be at least 1 character')
    .max(100, 'Opponent must be at most 100 characters'),
  threeDartAverage: z
    .number()
    .min(0, 'Three dart average must be at least 0')
    .max(180, 'Three dart average must be at most 180'),
  firstNineDartAverage: z
    .number()
    .min(0, 'First nine dart average must be at least 0')
    .max(540, 'First nine dart average must be at most 540'),
  checkoutThrown: z
    .number()
    .min(0, 'Checkout thrown must be at least 0')
    .max(100, 'Checkout thrown must be at most 100'),
  checkoutHits: z
    .number()
    .min(0, 'Checkout hits must be at least 0')
    .max(100, 'Checkout hits must be at most 100'),
  highestFinish: z
    .number()
    .min(0, 'Highest finish must be at least 0')
    .max(170, 'Highest finish must be at most 170'),
  highestScore: z
    .number()
    .min(0, 'Highest score must be at least 0')
    .max(180, 'Highest score must be at most 180'),
  bestLeg: z
    .number()
    .min(0, 'Best leg must be at least 0')
    .max(100, 'Best leg must be at most 100'),
  worstLeg: z
    .number()
    .min(0, 'Worst leg must be at least 0')
    .max(100, 'Worst leg must be at most 100'),
})

export const updateMatchGameSchema = createMatchGameSchema.partial()
