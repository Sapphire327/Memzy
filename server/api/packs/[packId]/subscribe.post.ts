import { and, db, eq, tables } from '#server/database/utils/database'
import ErrorHandler from '~~/server/utils/ErrorHandler'

export default defineEventHandler(async (event) => {
  try {
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
    const packId = parseInt(paramPackId)

    const pack = await db.query.packs.findFirst({
      where: eq(tables.packs.id, packId),
    })
    if (!pack) {
      throw createError({
        statusCode: 404,
        statusMessage: "pack not found",
        message: "Пак не найден",
        data: []
      })
    }
    if (!pack.isPublic) {
      throw createError({
        statusCode: 400,
        statusMessage: "pack is not public",
        message: "Нельзя подписаться на закрытый пак",
        data: []
      })
    }
    if (pack.authorId === session.user.id) {
      throw createError({
        statusCode: 400,
        statusMessage: "own pack",
        message: "Нельзя подписаться на свой пак",
        data: []
      })
    }

    const existing = await db.query.packsUsersSubscribe.findFirst({
      where: and(
        eq(tables.packsUsersSubscribe.packId, packId),
        eq(tables.packsUsersSubscribe.userId, session.user.id)
      )
    })
    if (!existing) {
      await db.insert(tables.packsUsersSubscribe).values({
        packId,
        userId: session.user.id,
      })
    }

    return { subscribed: true }
  } catch (e) {
    ErrorHandler(e)
  }
})
