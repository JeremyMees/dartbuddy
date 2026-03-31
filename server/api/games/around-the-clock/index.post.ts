import { createAroundTheClockGameSchema } from '#shared/form-schemas'

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (queries) =>
    createAroundTheClockGameSchema.safeParse(queries),
  )

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: error.issues,
    })
  }

  return await prisma.aroundTheClockGame.create({ data })
})
