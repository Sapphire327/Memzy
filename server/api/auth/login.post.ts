import z from 'zod/v4'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import { db, eq, tables } from '../../database/utils/database'

const loginSchema = z.object({
  login: z.string().min(1, 'Введите логин'),
  password: z.string().min(8, 'Пароль должен быть не менее 8 символов')
})

export default defineEventHandler(async (event) => {
  try{
    const body = await readValidatedBody(event, loginSchema.parse)
    const user = await db.query.users.findFirst({
      where: eq(tables.users.login, body.login),
    });
    if(!user){
      throw createError({
        statusCode:401,
        statusMessage:'incorrect login or password',
        message:"Неправильный логин или пароль",
        data:[]
      })
    }
    const result = await verifyPassword(user.passwordHash, body.password)
    if(!result){
      throw createError({
        statusCode:401,
        statusMessage:'incorrect login or password',
        message:"Неправильный логин или пароль",
        data:[]
      })
    }
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