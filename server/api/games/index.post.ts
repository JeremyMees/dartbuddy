import { gameCreateSchema } from '#shared/form-schemas/game'

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (body) =>
    gameCreateSchema.safeParse(body),
  )

  if (!success) throw error.issues

  const soloGame = data.playerIds.length === 1

  const game = await prisma.game.create({
    data: {
      startScore: data.startScore,
      outType: data.outType,
      legsToWin: data.legsToWin,
      setsToWin: data.setsToWin,
      ...(soloGame
        ? {
            activePlayerId: data.playerIds[0],
            startPlayerId: data.playerIds[0],
          }
        : {}),
      players: {
        create: data.playerIds.map((playerId, index) => ({
          playerId,
          seatOrder: index,
        })),
      },
      sets: {
        create: {
          number: 1,
          legs: {
            create: {
              number: 1,
            },
          },
        },
      },
    },
    include: {
      players: {
        include: {
          player: true,
        },
      },
      sets: {
        include: {
          legs: true,
        },
      },
      activePlayer: true,
    },
  })

  return game
})
