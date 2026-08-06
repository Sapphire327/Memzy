import { db, tables } from '#server/database/utils/database'
import { questCreateDtoSchema } from '#shared/schemas/pack.schema'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getUserPack from '~~/server/utils/getUserPack'
import { getImage, getText } from '~~/server/utils/questForm'
import { uploadImageToS3 } from '~~/server/utils/s3'

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
    const data = questCreateDtoSchema.parse({
      quest: getText(parts, 'quest'),
      answer: getText(parts, 'answer'),
      hint: getText(parts, 'hint'),
      exampleInText: getText(parts, 'exampleInText'),
    })
    const pack = await getUserPack(event)

    const questImage = getImage(parts, 'questImage')
    const answerImage = getImage(parts, 'answerImage')
    const questImgName = questImage ? await uploadImageToS3(questImage.buffer, questImage.type, questImage.ext) : null
    const answerImgName = answerImage ? await uploadImageToS3(answerImage.buffer, answerImage.type, answerImage.ext) : null

    const [quest] = await db.insert(tables.quests).values({
      quest: data.quest,
      answer: data.answer,
      hint: data.hint || null,
      exampleInText: data.exampleInText || null,
      questImgName,
      answerImgName,
      packId: pack.id,
    }).returning()
    return { quest }
  }catch(e){
    ErrorHandler(e)
  }
})
