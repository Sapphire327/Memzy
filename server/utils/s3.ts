import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomBytes } from 'node:crypto'

function getS3Config() {
  const config = useRuntimeConfig().s3
  if(!config?.endpoint || !config?.accessKeyId || !config?.secretAccessKey || !config?.bucket){
    throw createError({
      statusCode: 500,
      statusMessage: "S3 is not configured",
      message: "Хранилище не сконфигурировано",
      data: []
    })
  }
  return config
}

function getS3Client() {
  const config = getS3Config()
  return new S3Client({
    region: config.region || 'ru-central1',
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })
}

export function generateImageKey(ext: string) {
  return `quests/${Date.now()}_${randomBytes(12).toString('hex')}.${ext}`
}

export async function uploadImageToS3(buffer: Buffer, contentType: string, ext: string) {
  const config = getS3Config()
  const key = generateImageKey(ext)
  await getS3Client().send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))
  return key
}

export function getImageUrl(key: string) {
  const publicUrl = useRuntimeConfig().public?.s3?.publicUrl
  if(!publicUrl) return key
  return `${publicUrl.replace(/\/$/, '')}/${key}`
}