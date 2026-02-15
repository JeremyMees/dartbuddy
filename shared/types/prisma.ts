import type { Prisma } from '~~/server/generated/prisma/client'

export type { User } from '~~/server/generated/prisma/client'

export type CreateUser = Prisma.UserCreateInput
export type UpdateUser = Prisma.UserUpdateInput

// export type UserWithPosts = Prisma.UserGetPayload<{
//   include: { posts: true }
// }>
