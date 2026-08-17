import { and, db, eq, tables } from '#server/database/utils/database'
import { inArray } from 'drizzle-orm'
import { z } from 'zod'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getAccessiblePackIds from '~~/server/utils/getAccessiblePackIds'
import { calculateRepeatResult } from '~~/server/utils/repeat'

const answersSchema = z.array(z.object({
  questId: z.number().int().positive(),
  isRight: z.boolean(),
})).min(1)

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

    const answers = answersSchema.parse(await readBody(event))
    const questIds = answers.map((answer) => answer.questId)

    const quests = await db.select({ id: tables.quests.id, packId: tables.quests.packId })
      .from(tables.quests)
      .where(inArray(tables.quests.id, questIds))
    if (quests.length !== questIds.length) {
      throw createError({
        statusCode: 400,
        statusMessage: "quests do not exist",
        message: "Некоторые слова не найдены",
        data: []
      })
    }

    const accessiblePackIds = await getAccessiblePackIds(userId)
    const accessibleSet = new Set(accessiblePackIds)
    if (quests.some((quest) => !accessibleSet.has(quest.packId))) {
      throw createError({
        statusCode: 400,
        statusMessage: "quests are not accessible",
        message: "Некоторые слова недоступны",
        data: []
      })
    }

    const existingRows = await db.select({
      questId: tables.questsUsers.questId,
      level: tables.questsUsers.level,
      stage: tables.questsUsers.stage,
    })
      .from(tables.questsUsers)
      .where(and(
        eq(tables.questsUsers.userId, userId),
        inArray(tables.questsUsers.questId, questIds)
      ))
    const existingMap = new Map(existingRows.map((row) => [row.questId, row]))

    await db.transaction(async (tx) => {
      const now = new Date()
      for (const { questId, isRight } of answers) {
        const current = existingMap.get(questId)
        const { level, stage, nextRepeat } = calculateRepeatResult(current, isRight, now)

        const values = { lastRepeated: now, NextRepeated: nextRepeat, level, stage }
        if (current) {
          await tx.update(tables.questsUsers)
            .set(values)
            .where(and(
              eq(tables.questsUsers.questId, questId),
              eq(tables.questsUsers.userId, userId)
            ))
        } else {
          await tx.insert(tables.questsUsers)
            .values({ ...values, questId, userId })
        }
      }
    })

    return { updated: answers.length }
  } catch (e) {
    ErrorHandler(e)
  }
})
