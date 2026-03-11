import { userUpdateSchema } from '#shared/form-schemas/user'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  const data = await readValidatedBody(event, (body) =>
    userUpdateSchema.parse(body),
  )

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
