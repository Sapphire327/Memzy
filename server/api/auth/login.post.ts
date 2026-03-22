import z from 'zod/v4'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import { db, eq, tables } from '../../database/utils/database'
const registrationSchema = z.object({
  email:z.email(),
  password:z.string()
})
export default defineEventHandler(async (event) => {
  try{
    const body = await readValidatedBody(event,registrationSchema.parse)
    const user = await db.query.users.findFirst({
      where: eq(tables.users.email,body.email ),
    });
    if(!user){
      throw createError({
        statusCode:401,
        statusMessage:'incorrect login or password',
        message:"Неправильная почта или пароль",
        data:[]
      })
    }
    const result = await verifyPassword(user.passwordHash,body.password)
      if(!result){
      throw createError({
        statusCode:401,
        statusMessage:'incorrect login or password',
        message:"Неправильная почта или пароль",
        data:[]
      })
    }
    if(!user.hasActivated){
       throw createError({
        statusCode:401,
        statusMessage:'The email isn\'t confirm',
        message:"Почта не подтверждена",
        data:[]
      })
    }
    await setUserSession(event,{
      user:{
        id:user.id,
        name:user.name,
        email:user.email
      }
    })

    return{success:true}
  }catch(e){
    ErrorHandler(e) 
  }
})
