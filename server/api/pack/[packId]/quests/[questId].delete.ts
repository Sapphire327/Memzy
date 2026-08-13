import { db, eq, tables } from '#server/database/utils/database'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getUserPack from '~~/server/utils/getUserPack'
import { deleteImageFromS3 } from '~~/server/utils/s3'

async function deleteImages(keys: (string | null | undefined)[]) {
  await Promise.all(keys.filter(Boolean).map((key) => deleteImageFromS3(key!).catch(() => {})))
}

export default defineEventHandler(async (event) => {
  try{
    const pack = await getUserPack(event)

    const paramQuestId = getRouterParam(event, 'questId')
    if(!paramQuestId || Number.isNaN(parseInt(paramQuestId))){
      throw createError({
        statusCode: 400,
        statusMessage: "incorrect quest id",
        message: "Передан некорректный id слова",
        data: []
      })
    }
    const questId = parseInt(paramQuestId)
    const existing = await db.query.quests.findFirst({
      where: eq(tables.quests.id, questId),
    })
    if(!existing || existing.packId !== pack.id){
      throw createError({
        statusCode: 404,
        statusMessage: "quest not found",
        message: "Слово не найдено",
        data: []
      })
    }

    await db.transaction(async (tx) => {
      await tx.delete(tables.questsUsers).where(eq(tables.questsUsers.questId, questId))
      await tx.delete(tables.quests).where(eq(tables.quests.id, questId))
    })

    await deleteImages([existing.questImgName, existing.answerImgName])

    return { deleted: questId }
  }catch(e){
    ErrorHandler(e)
  }
})
