import { z } from 'zod'
import { segments } from '~~/constants/segments'

export const turnCreateSchema = z.object({
  legId: z.string(),
  playerId: z.string(),
  startingScore: z
    .number()
    .min(1, 'Starting score must be at least 1')
    .max(10000, 'Starting score must be less than 10000'),
  throws: z.array(
    z.object({
      segment: z.enum(segments),
      scored: z
        .number()
        .min(0, 'Scored points cannot be negative')
        .max(180, 'Scored points cannot exceed 180'),
    }),
  ),
  isBust: z.boolean().optional().default(false),
  winnerId: z.string().optional(),
})
