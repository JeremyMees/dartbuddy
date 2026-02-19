import { z } from 'zod'

export const legCreateSchema = z.object({
  setId: z.string(),
  number: z
    .number()
    .min(1, 'Leg number must be at least 1')
    .max(100, 'Leg number must be less than 100'),
})
