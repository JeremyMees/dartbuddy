import { userCreateSchema } from '#shared/form-schemas/user'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (body) =>
    userCreateSchema.parse(body),
  )

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      nickName: data.nickName,
    },
  })

  return user
})
