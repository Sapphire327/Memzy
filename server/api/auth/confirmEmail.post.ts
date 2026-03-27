import { db, eq, tables } from '#server/database/utils/database'
import jwt from 'jsonwebtoken'
import ErrorHandler from '~~/server/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  try{
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw createError({
        statusCode: 500,
        statusMessage: "Server configuration error",
        message:"Ошибка конфигурации сервера",
      });
    }
    const body = await readBody<{token:string}>(event);
    if(!body.token){
      throw createError({
          statusCode:400,
          statusMessage: "Incorrect token",
          message:"Ссылка недействительна",
          data:[]
      });
    }
    const payload = jwt.verify(body.token,secret) as {email:string}
    if(!payload.email){
      throw createError({
          statusCode:400,
          statusMessage: "Incorrect token",
          message:"Ссылка недействительна",
          data:[]
      });
    }
    await db.update(tables.users).set({hasActivated:true}).where(eq(tables.users.email,payload.email))
    return {success:true}
  }catch(e){
    ErrorHandler(e)
  }
})
