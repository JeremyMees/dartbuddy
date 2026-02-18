import { userCreateSchema } from '#shared/form-schemas/user'

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(event, (body) =>
    userCreateSchema.safeParse(body),
  )

  if (!success) throw error.issues

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      nickName: data.nickName,
    },
  })

  console.log({ user })

  return user
})
