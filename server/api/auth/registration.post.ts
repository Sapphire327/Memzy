import { db, eq, tables } from '#server/database/utils/database'
import z from 'zod/v4'
import ErrorHandler from '~~/server/utils/ErrorHandler'

const registrationSchema = z.object({
  login: z.string().min(3, 'Логин должен быть не менее 3 символов').max(50, 'Логин не может быть длиннее 50 символов'),
  name: z.string().min(3, 'Имя должно быть не менее 3 символов'),
  password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
})

export default defineEventHandler(async (event) => {
    try{
      const body = await readBody(event);
      const data = registrationSchema.parse(body)

      const findedUser = await db.query.users.findFirst({
        where: eq(tables.users.login, data.login),
      });
      if(findedUser){
        throw createError({
            statusCode: 409,
            statusMessage: "Account with this login already exists",
            message: "Пользователь с таким логином уже существует",
            data: []
        });
      }

      const hashedPassword = await hashPassword(data.password)
      const [user] = await db.insert(tables.users).values({
        login: data.login,
        name: data.name,
        passwordHash: hashedPassword,
      }).returning()
      if(user)
      await setUserSession(event, {
        user: {
          id: user.id,
          name: user.name,
          login: user.login
        }
      })

      return { success: true }
  }catch(e){
    ErrorHandler(e)
  }
})