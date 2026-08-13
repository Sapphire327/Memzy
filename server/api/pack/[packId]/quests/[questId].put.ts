import { db, eq, tables } from '#server/database/utils/database'
import { questEditDtoSchema } from '#shared/schemas/pack.schema'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getUserPack from '~~/server/utils/getUserPack'
import { getBoolean, getImage, getText } from '~~/server/utils/questForm'
import { deleteImageFromS3, uploadImageToS3 } from '~~/server/utils/s3'

async function deleteImages(keys: (string | null | undefined)[]) {
  await Promise.all(keys.filter(Boolean).map((key) => deleteImageFromS3(key!).catch(() => {})))
}

export default defineEventHandler(async (event) => {
  try{
    const parts = await readMultipartFormData(event)
    if(!parts){
      throw createError({
        statusCode: 400,
        statusMessage: "invalid form data",
        message: "Некорректные данные формы",
        data: []
      })
    }
    const data = questEditDtoSchema.parse({
      quest: getText(parts, 'quest'),
      answer: getText(parts, 'answer'),
      hint: getText(parts, 'hint'),
      exampleInText: getText(parts, 'exampleInText'),
      removeQuestImage: getBoolean(parts, 'removeQuestImage'),
      removeAnswerImage: getBoolean(parts, 'removeAnswerImage'),
    })
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

    const oldQuestImgName = existing.questImgName
    const oldAnswerImgName = existing.answerImgName
    const questImage = getImage(parts, 'questImage')
    const answerImage = getImage(parts, 'answerImage')
    const questImgName = data.removeQuestImage ? null : questImage ? await uploadImageToS3(questImage.buffer, questImage.type, questImage.ext) : existing.questImgName
    const answerImgName = data.removeAnswerImage ? null : answerImage ? await uploadImageToS3(answerImage.buffer, answerImage.type, answerImage.ext) : existing.answerImgName

    const [quest] = await db.update(tables.quests).set({
      quest: data.quest,
      answer: data.answer,
      hint: data.hint || null,
      exampleInText: data.exampleInText || null,
      questImgName,
      answerImgName,
    }).where(eq(tables.quests.id, questId)).returning()

    if (questImgName !== oldQuestImgName) await deleteImages([oldQuestImgName])
    if (answerImgName !== oldAnswerImgName) await deleteImages([oldAnswerImgName])
    return { quest }
  }catch(e){
    ErrorHandler(e)
  }
})
