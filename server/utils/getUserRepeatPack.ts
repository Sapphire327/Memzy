import { and, db, eq, tables } from '#server/database/utils/database'
import type { H3Event } from 'h3'

export default async function getUserRepeatPack(event: H3Event) {
  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Ошибка авторизации",
      data: []
    })
  }
  const paramId = getRouterParam(event, 'id')
  if (!paramId || Number.isNaN(parseInt(paramId))) {
    throw createError({
      statusCode: 400,
      statusMessage: "incorrect id",
      message: "Передан некорректный id",
      data: []
    })
  }
  const id = parseInt(paramId)
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
  const isAuthor = pack.authorId === session.user.id
  let hasAccess = isAuthor
  if (!isAuthor) {
    const subscription = await db.query.packsUsersSubscribe.findFirst({
      where: and(
        eq(tables.packsUsersSubscribe.packId, id),
        eq(tables.packsUsersSubscribe.userId, session.user.id)
      )
    })
    hasAccess = !!subscription
  }
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden pack",
      message: "У вас нет доступа к этому паку",
      data: []
    })
  }
  return { pack, userId: session.user.id }
}