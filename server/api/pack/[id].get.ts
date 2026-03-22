import { db, eq, tables } from '#server/database/utils/database'
import type { Pack } from '#shared/schemas/pack.schema'
import ErrorHandler from '~~/server/utils/ErrorHandler'
export default defineEventHandler(async (event) => {
    try{
      const session = await getUserSession(event)
      if(!session||!session.user){
          throw createError({
          statusCode: 401,
          statusMessage: "Unauthorized",
          message:"Ошибка авторизации",
          data:[]
        });
      }
      const paramId = getRouterParam(event, 'id');
      if(!paramId||Number.isNaN(parseInt(paramId))){
        throw createError({
          statusCode: 400,
          statusMessage: "incorrect id",
          message:"Передан некорректный id",
          data:[]
        });
      }
      const id = parseInt(paramId)
      const pack = await db.query.packs.findFirst({
        where: eq(tables.packs.id,id ),
      });
      
      if(!pack){
        throw createError({
          statusCode: 400,
          statusMessage: "pack with this id was not found",
          message:"Пак с данным id не был найден",
          data:[]
        });
      }
      if(pack.authorId!=session.user.id){
         throw createError({
          statusCode: 403,
          statusMessage: "Forbidden pack",
          message:"У вас нет доступа к этому паку",
          data:[]
        });
      }
      const tags = await db.select({ id: tables.tags.id, name: tables.tags.name }).from(tables.packsTags).
      innerJoin(tables.tags, eq(tables.packsTags.tagId, tables.tags.id)).where(eq(tables.packsTags.packId, pack.id))
      const result:Pack = {
        id: pack.id,
        name: pack.name,
        description: pack.description,
        isPublic: pack.isPublic||false,
        tags: tags,
      }
      return {pack:result}
  }catch(e){
    ErrorHandler(e)
  }
})
