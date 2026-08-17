import { and, db, eq, tables } from '#server/database/utils/database'
import type { RepeatableQuest } from '#shared/schemas'
import { asc, inArray, isNull, lt, or } from "drizzle-orm"
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getAccessiblePackIds from '~~/server/utils/getAccessiblePackIds'

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
    const userId = session.user.id

    const accessiblePackIds = await getAccessiblePackIds(userId)
    if (!accessiblePackIds.length) {
      return { quests: [] }
    }

    const quests: RepeatableQuest[] = await db.select({
      id: tables.quests.id,
      quest: tables.quests.quest,
      answer: tables.quests.answer,
      hint: tables.quests.hint,
      exampleInText: tables.quests.exampleInText,
      questImgName: tables.quests.questImgName,
      answerImgName: tables.quests.answerImgName,
      packId: tables.quests.packId,
      lastRepeated: tables.questsUsers.lastRepeated,
      NextRepeated: tables.questsUsers.NextRepeated,
      level: tables.questsUsers.level,
      stage: tables.questsUsers.stage,
    })
      .from(tables.quests)
      .leftJoin(tables.questsUsers, and(
        eq(tables.questsUsers.questId, tables.quests.id),
        eq(tables.questsUsers.userId, userId)
      ))
      .where(and(
        inArray(tables.quests.packId, accessiblePackIds),
        or(isNull(tables.questsUsers.NextRepeated), lt(tables.questsUsers.NextRepeated, new Date()))
      ))
      .orderBy(asc(tables.quests.id))

    return { quests }
  } catch (e) {
    ErrorHandler(e)
  }
})
