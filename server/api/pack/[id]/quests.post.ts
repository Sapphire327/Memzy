import { db, tables } from '#server/database/utils/database'
import { questCreateDtoSchema } from '#shared/schemas/pack.schema'
import type { MultiPartData } from 'h3'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getUserPack from '~~/server/utils/getUserPack'
import { uploadImageToS3 } from '~~/server/utils/s3'

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif']
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

function getText(parts: MultiPartData[], name: string) {
  const part = parts.find((p) => p.name === name)
  return part ? part.data.toString('utf-8') : undefined
}

function getImage(parts: MultiPartData[], name: string) {
  const part = parts.find((p) => p.name === name)
  if(!part || !part.filename || !part.data || part.data.length === 0) return null
  const dot = part.filename.lastIndexOf('.')
  const ext = dot === -1 ? '' : part.filename.slice(dot + 1).toLowerCase()
  const type = part.type || ''
  if(!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_TYPES.includes(type)){
    throw createError({
      statusCode: 400,
      statusMessage: "invalid image type",
      message: "Допустимые форматы картинок: png, jpg, webp, gif",
      data: []
    })
  }
  if(part.data.length > MAX_IMAGE_SIZE){
    throw createError({
      statusCode: 400,
      statusMessage: "image too large",
      message: "Картинка не может быть больше 5 МБ",
      data: []
    })
  }
  return { buffer: part.data, type, ext }
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