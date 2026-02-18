import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().default(0),
  amount: z.coerce.number().default(10),
})

export default defineEventHandler(async (event) => {
  const { success, data, error } = await getValidatedQuery(event, (queries) =>
    querySchema.safeParse(queries),
  )

  if (!success) throw error.issues

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: data.page * data.amount,
      take: data.amount,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.user.count(),
  ])

  return {
    users,
    pagination: {
      page: data.page,
      amount: data.amount,
      total,
      totalPages: Math.ceil(total / data.amount),
    },
  }
})
