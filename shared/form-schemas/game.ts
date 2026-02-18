import { z } from 'zod'

export const gameCreateSchema = z.object({
  startScore: z
    .number()
    .min(2, 'Start score must be at least 2')
    .max(1000, 'Start score must be less than 1000'),
  legsToWin: z
    .number()
    .min(1, 'Legs to win must be at least 1')
    .max(50, 'Legs to win must be less than 50'),
  setsToWin: z
    .number()
    .min(1, 'Sets to win must be at least 1')
    .max(50, 'Sets to win must be less than 50'),
  outType: z.enum(['DOUBLE', 'MASTER', 'STRAIGHT']),
  playerIds: z
    .array(z.string().uuid('Invalid player ID'))
    .min(1, 'At least 1 player is required')
    .max(10, 'Maximum 10 players allowed'),
})
