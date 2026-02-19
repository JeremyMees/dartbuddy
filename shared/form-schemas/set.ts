import { z } from 'zod'

export const setCreateSchema = z.object({
  number: z.number(),
})
