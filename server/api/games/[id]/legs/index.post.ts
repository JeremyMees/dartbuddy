import { legCreateSchema } from '~~/shared/form-schemas/leg'

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (queries) =>
    legCreateSchema.safeParse(queries),
  )

  if (!success) throw error.issues

  const gameId = getRouterParam(event, 'id')
  const { setId, number } = data

  if (!gameId || !setId || !number) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Required fields are missing or invalid',
    })
  }

  const leg = await prisma.leg.create({
    data: {
      setId,
      number,
    },
  })

  return leg
})
