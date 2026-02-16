import { userUpdateSchema } from '#shared/form-schemas/user'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  const { success, data, error } = await readValidatedBody(event, (body) =>
    userUpdateSchema.safeParse(body),
  )

  if (!success) throw error.issues

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      nickName: data.nickName,
    },
  })

  return user
})
