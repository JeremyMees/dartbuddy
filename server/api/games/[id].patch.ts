import { z } from 'zod'

const querySchema = z.object({
  activePlayerId: z.string().optional(),
  winnerId: z.string().optional(),
  completedAt: z.string().optional(),
  endReason: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (queries) =>
    querySchema.safeParse(queries),
  )

  if (!success) throw error.issues

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  const updateData = removeEmptyValues(data)

  const game = await prisma.game.update({
    where: { id },
    data: updateData,
    include: {
      players: {
        include: {
          player: true,
        },
      },
      sets: {
        include: {
          winner: true,
          legs: {
            include: {
              winner: true,
              turns: {
                include: {
                  throws: true,
                  player: true,
                },
              },
            },
          },
        },
      },
      winner: true,
      activePlayer: true,
    },
  })

  return game
})
