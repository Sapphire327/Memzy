import { db, tables } from '#server/database/utils/database'
import { packCreateDtoSchema } from '#shared/schemas/pack.schema'
import ErrorHandler from '~~/server/utils/ErrorHandler'
export default defineEventHandler(async (event) => {
    try{
      const body = await readBody(event);
      const data = packCreateDtoSchema.parse(body);
      const session = await getUserSession(event)
      if(!session||!session.user){
          throw createError({
          statusCode: 401,
          statusMessage: "Unauthorized",
          message:"Ошибка авторизации",
          data:[]
        });
      }
      const packs = await db.insert(tables.packs).values({
        ...data,
        authorId:session.user.id
      }).returning()
      return{pack:packs[0]}
  }catch(e){
    ErrorHandler(e)
  }
})
