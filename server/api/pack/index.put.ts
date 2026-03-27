import { packEditDtoSchema } from '#imports'
import { and, db, eq, tables } from '#server/database/utils/database'
import { inArray, sql } from 'drizzle-orm'
import ErrorHandler from '~~/server/utils/ErrorHandler'
export default defineEventHandler(async (event) => {
  try{
    const body = await readBody(event);
    const data = packEditDtoSchema.parse(body);
    const session = await getUserSession(event)
    if(!session||!session.user){
        throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message:"Ошибка авторизации",
        data:[]
      });
    }
    const pack = await db.query.packs.findFirst({
        where: eq(tables.packs.id,data.id ),
      });
    if(!pack){
      throw createError({
        statusCode: 404,
        statusMessage: "Pack wasn't found",
        message:"Пак не найден",
      })
    }
    if(pack.authorId!=session.user.id){
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden access",
        message:"Нет доступа для изменения этого пака",
      })
    }
    if(data.deletedTags.length>0){
      await db.delete(tables.packsTags).where(
        and(
          eq(tables.packsTags.packId,pack.id),
          inArray(tables.packsTags.tagId,data.deletedTags)
        )
      )
    }
    if(data.addedTags.length>0){
      const addedTags = await db.insert(tables.tags)
      .values(data.addedTags.map(tag=>{return{name:tag.name}}))
      .onConflictDoUpdate({target:tables.tags.name,set:{ name: sql`excluded.name`}})
      .returning({id:tables.tags.id})
      await db.insert(tables.packsTags).values(addedTags.map((tag)=>{return{packId:pack.id,tagId:tag.id}}))
    }
    await db.update(tables.packs).set({
      name:data.name,
      description:data.description,
      isPublic:data.isPublic,
    }).where(eq(tables.packs.id, pack.id))
}catch(e){
  ErrorHandler(e)
}

})
