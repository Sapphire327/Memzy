import { db, eq, tables } from '#server/database/utils/database'
import z from 'zod/v4'
import ErrorHandler from '~~/server/utils/ErrorHandler'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Введите текущий пароль'),
  newPassword: z.string().min(8, 'Новый пароль должен быть не менее 8 символов'),
})

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Ошибка авторизации",
        data: []
      })
    }

    const body = await readValidatedBody(event, changePasswordSchema.parse)

    const user = await db.query.users.findFirst({
      where: eq(tables.users.id, session.user.id),
    })
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Ошибка авторизации",
        data: []
      })
    }

    const valid = await verifyPassword(user.passwordHash, body.currentPassword)
    if (!valid) {
      throw createError({
        statusCode: 400,
        statusMessage: "Wrong password",
        message: "Неправильный текущий пароль",
        data: []
      })
    }

    if (body.currentPassword === body.newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "Same password",
        message: "Новый пароль не должен совпадать с текущим",
        data: []
      })
    }

    const hashedPassword = await hashPassword(body.newPassword)
    await db.update(tables.users)
      .set({ passwordHash: hashedPassword })
      .where(eq(tables.users.id, user.id))

    return { success: true }
  } catch (e) {
    ErrorHandler(e)
  }
})
