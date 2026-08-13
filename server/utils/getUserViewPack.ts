import { and, db, eq, tables } from '#server/database/utils/database'
import type { H3Event } from 'h3'

export default async function getUserViewPack(event: H3Event) {
  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Ошибка авторизации",
      data: []
    })
  }
  const paramPackId = getRouterParam(event, 'packId')
  if (!paramPackId || Number.isNaN(parseInt(paramPackId))) {
    throw createError({
      statusCode: 400,
      statusMessage: "incorrect id",
      message: "Передан некорректный id",
      data: []
    })
  }
  const id = parseInt(paramPackId)
  const pack = await db.query.packs.findFirst({
    where: eq(tables.packs.id, id),
  })
  if (!pack) {
    throw createError({
      statusCode: 404,
      statusMessage: "pack with this id was not found",
      message: "Пак с данным id не был найден",
      data: []
    })
  }
  if (pack.authorId === session.user.id) {
    return { pack, userId: session.user.id, isOwner: true }
  }
  if (pack.isPublic) {
    const subscription = await db.query.packsUsersSubscribe.findFirst({
      where: and(
        eq(tables.packsUsersSubscribe.packId, id),
        eq(tables.packsUsersSubscribe.userId, session.user.id)
      )
    })
    if (subscription) {
      return { pack, userId: session.user.id, isOwner: false }
    }
  }
  throw createError({
    statusCode: 403,
    statusMessage: "Forbidden pack",
    message: "У вас нет доступа к этому паку",
    data: []
  })
}
