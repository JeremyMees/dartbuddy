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

  const [games, total] = await Promise.all([
    prisma.game.findMany({
      skip: data.page * data.amount,
      take: data.amount,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        players: {
          orderBy: { seatOrder: 'asc' },
          include: {
            player: true,
          },
        },
        sets: {
          orderBy: { number: 'asc' },
          include: {
            winner: true,
            legs: {
              orderBy: { number: 'asc' },
              include: {
                winner: true,
              },
            },
          },
        },
        winner: true,
      },
    }),
    prisma.game.count(),
  ])

  return {
    games,
    pagination: {
      page: data.page,
      amount: data.amount,
      total,
      totalPages: Math.ceil(total / data.amount),
    },
  }
})
