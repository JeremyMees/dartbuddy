import { setCreateSchema } from '~~/shared/form-schemas/set'

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (queries) =>
    setCreateSchema.safeParse(queries),
  )

  if (!success) throw error.issues

  const gameId = getRouterParam(event, 'id')
  const { number } = data

  if (!gameId || !number) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Required fields are missing or invalid',
    })
  }

  const set = await prisma.set.create({
    data: {
      gameId,
      number,
      legs: {
        create: {
          number: 1,
        },
      },
    },
    include: {
      legs: true,
    },
  })

  return set
})
