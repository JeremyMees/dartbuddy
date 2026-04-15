import { createMatchGameSchema } from '#shared/form-schemas'

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (queries) =>
    createMatchGameSchema.safeParse(queries),
  )

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: error.issues,
    })
  }

  return await prisma.matchGame.create({ data })
})
