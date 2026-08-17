import { db, eq, tables } from '#server/database/utils/database'
import type { UsersPack } from '#shared/schemas'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getUserViewPack from '~~/server/utils/getUserViewPack'
export default defineEventHandler(async (event) => {
    try{
      const { pack, isSubscribed } = await getUserViewPack(event)
      const tags = await db.select({ id: tables.tags.id, name: tables.tags.name }).from(tables.packsTags).
      innerJoin(tables.tags, eq(tables.packsTags.tagId, tables.tags.id)).where(eq(tables.packsTags.packId, pack.id))
      const result: UsersPack = {
        id: pack.id,
        name: pack.name,
        description: pack.description,
        isPublic: pack.isPublic||false,
        tags: tags,
        authorId: pack.authorId,
        isSubscribed,
      }
      return {pack:result}
  }catch(e){
    ErrorHandler(e)
  }
})