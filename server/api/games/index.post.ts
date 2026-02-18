import { gameCreateSchema } from '#shared/form-schemas/game'

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (body) =>
    gameCreateSchema.safeParse(body),
  )

  if (!success) throw error.issues

  const game = await prisma.game.create({
    data: {
      startScore: data.startScore,
      outType: data.outType,
      legsToWin: data.legsToWin,
      setsToWin: data.setsToWin,
      players: {
        create: data.playerIds.map((playerId, index) => ({
          playerId,
          seatOrder: index,
        })),
      },
    },
    include: {
      players: {
        include: {
          player: true,
        },
      },
    },
  })

  return game
})
