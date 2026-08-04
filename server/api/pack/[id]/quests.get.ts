import { db, eq, tables } from '#server/database/utils/database'
import type { Quest } from '#shared/schemas'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getUserPack from '~~/server/utils/getUserPack'

export default defineEventHandler(async (event) => {
  try{
    const pack = await getUserPack(event)
    const quests: Quest[] = await db.select().from(tables.quests).where(eq(tables.quests.packId, pack.id))
    return { quests }
  }catch(e){
    ErrorHandler(e)
  }
})