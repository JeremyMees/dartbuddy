import { z } from 'zod'
import { segments } from '~~/constants/segments'

export const throwCreateSchema = z.object({
  turnId: z.string(),
  playerId: z.string(),
  order: z.number().min(1, 'Throw order must be at least 1'),
  segment: z.enum(segments),
  scored: z.number().min(0, 'Scored points cannot be negative'),
})
