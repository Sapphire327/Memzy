import type { MultiPartData } from 'h3'

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif']
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function getText(parts: MultiPartData[], name: string) {
  const part = parts.find((p) => p.name === name)
  return part ? part.data.toString('utf-8') : undefined
}

export function getBoolean(parts: MultiPartData[], name: string) {
  const value = getText(parts, name)
  return value === 'true' || value === '1'
}

export function getImage(parts: MultiPartData[], name: string) {
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
