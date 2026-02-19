import { turnCreateSchema } from '#shared/form-schemas/turn'

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (queries) =>
    turnCreateSchema.safeParse(queries),
  )

  if (!success) throw error.issues

  const gameId = getRouterParam(event, 'id')
  const { legId, playerId, throws, startingScore, isBust } = data

  if (!gameId || !legId || !playerId || !throws || !Array.isArray(throws)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Required fields are missing or invalid',
    })
  }

  const totalScored = throws.reduce((sum, t) => sum + (t.scored || 0), 0)
  const remainingScore = isBust ? startingScore : startingScore - totalScored

  await prisma.turn.create({
    data: {
      legId,
      playerId,
      startingScore,
      totalScored,
      remainingScore,
      isBust,
      throws: {
        create: throws.map((throwData, index) => ({
          playerId,
          order: index + 1,
          segment: throwData.segment,
          scored: throwData.scored || 0,
        })),
      },
    },
    include: {
      throws: true,
      player: true,
    },
  })

  const game = await $fetch(`/api/games/${gameId}`)

  return game
})
