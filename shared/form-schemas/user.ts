import { z } from 'zod'

export const userCreateSchema = z.object({
  firstName: z
    .string()
    .min(3, 'First name must be at least 3 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(3, 'Last name must be at least 3 characters')
    .max(50, 'Last name must be less than 50 characters'),
  nickName: z
    .string()
    .min(3, 'Nickname must be at least 3 characters')
    .max(50, 'Nickname must be less than 50 characters'),
})

export const userUpdateSchema = userCreateSchema.partial()
