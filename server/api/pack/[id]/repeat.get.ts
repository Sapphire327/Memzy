import { and, db, eq, tables } from '#server/database/utils/database'
import type { RepeatableQuest } from '#shared/schemas'
import { asc, isNull, or, lt } from "drizzle-orm"
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getUserRepeatPack from '~~/server/utils/getUserRepeatPack'

export default defineEventHandler(async (event) => {
  try {
    const { pack, userId } = await getUserRepeatPack(event)

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
        eq(tables.quests.packId, pack.id),
        or(isNull(tables.questsUsers.NextRepeated), lt(tables.questsUsers.NextRepeated, new Date()))
      ))
      .orderBy(asc(tables.quests.id))

    return { quests }
  } catch (e) {
    ErrorHandler(e)
  }
})