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

    await db.delete(tables.packsUsersSubscribe).where(and(
      eq(tables.packsUsersSubscribe.packId, packId),
      eq(tables.packsUsersSubscribe.userId, session.user.id)
    ))

    return { subscribed: false }
  } catch (e) {
    ErrorHandler(e)
  }
})
