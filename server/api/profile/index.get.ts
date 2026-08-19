import { and, db, eq, tables } from '#server/database/utils/database'
import { asc, inArray, isNull, lt, max, min, or, sql } from 'drizzle-orm'
import type { LevelBucket, ProfileDashboard, ProfilePackProgress } from '#shared/schemas'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getAccessiblePackIds from '~~/server/utils/getAccessiblePackIds'
import padBuckets from '~~/server/utils/padBuckets'
import { MAX_LEVEL, MAX_STAGE } from '~~/server/utils/repeat'

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

    const user = await db.query.users.findFirst({
      where: eq(tables.users.id, userId),
      columns: { login: true, createdAt: true },
    })

    let dueCount = 0
    if (accessiblePackIds.length) {
      const [dueRow] = await db.select({ value: sql`count(*)`.mapWith(Number) })
        .from(tables.quests)
        .leftJoin(tables.questsUsers, and(
          eq(tables.questsUsers.questId, tables.quests.id),
          eq(tables.questsUsers.userId, userId)
        ))
        .where(and(
          inArray(tables.quests.packId, accessiblePackIds),
          or(isNull(tables.questsUsers.NextRepeated), lt(tables.questsUsers.NextRepeated, new Date()))
        ))
      dueCount = dueRow?.value ?? 0
    }

    const levelRows = accessiblePackIds.length
      ? await db.select({ key: tables.questsUsers.level, value: sql`count(*)`.mapWith(Number) })
        .from(tables.questsUsers)
        .innerJoin(tables.quests, eq(tables.questsUsers.questId, tables.quests.id))
        .where(and(
          eq(tables.questsUsers.userId, userId),
          inArray(tables.quests.packId, accessiblePackIds)
        ))
        .groupBy(tables.questsUsers.level)
      : []

    const stageRows = accessiblePackIds.length
      ? await db.select({ key: tables.questsUsers.stage, value: sql`count(*)`.mapWith(Number) })
        .from(tables.questsUsers)
        .innerJoin(tables.quests, eq(tables.questsUsers.questId, tables.quests.id))
        .where(and(
          eq(tables.questsUsers.userId, userId),
          inArray(tables.quests.packId, accessiblePackIds)
        ))
        .groupBy(tables.questsUsers.stage)
      : []

    const levelDistribution = padBuckets(
      levelRows
        .filter((row) => row.key !== null)
        .map((row) => ({ key: row.key as number, count: row.value })),
      MAX_LEVEL
    )

    const stageDistribution = padBuckets(
      stageRows
        .filter((row) => row.key !== null)
        .map((row) => ({ key: row.key as number, count: row.value })),
      MAX_STAGE
    )

    const learningCount = levelDistribution.reduce((sum, bucket) => sum + bucket.count, 0)
    const fullyLearnedCount = levelDistribution
      .filter((bucket) => bucket.key >= 4)
      .reduce((sum, bucket) => sum + bucket.count, 0)
    const inProgressCount = learningCount - fullyLearnedCount

    let lastTraining: Date | null = null
    if (accessiblePackIds.length) {
      const [lastRow] = await db.select({ value: max(tables.questsUsers.lastRepeated) })
        .from(tables.questsUsers)
        .innerJoin(tables.quests, eq(tables.questsUsers.questId, tables.quests.id))
        .where(and(
          eq(tables.questsUsers.userId, userId),
          inArray(tables.quests.packId, accessiblePackIds)
        ))
      lastTraining = lastRow?.value ?? null
    }

    const packRows = accessiblePackIds.length
      ? await db.select({
          id: tables.packs.id,
          name: tables.packs.name,
          isPublic: tables.packs.isPublic,
          totalQuests: sql`count(*)`.mapWith(Number),
          learnedQuests: sql`count(${tables.questsUsers.id})`.mapWith(Number),
          lastRepeat: max(tables.questsUsers.lastRepeated),
          nextRepeat: min(tables.questsUsers.NextRepeated),
        })
        .from(tables.packs)
        .leftJoin(tables.quests, eq(tables.quests.packId, tables.packs.id))
        .leftJoin(tables.questsUsers, and(
          eq(tables.questsUsers.questId, tables.quests.id),
          eq(tables.questsUsers.userId, userId)
        ))
        .where(inArray(tables.packs.id, accessiblePackIds))
        .groupBy(tables.packs.id, tables.packs.name, tables.packs.isPublic)
        .orderBy(asc(tables.packs.id))
      : []

    const packs: ProfilePackProgress[] = packRows.map((pack) => ({
      id: pack.id,
      name: pack.name,
      isPublic: pack.isPublic || false,
      totalQuests: pack.totalQuests,
      learnedQuests: pack.learnedQuests,
      lastRepeat: pack.lastRepeat ?? undefined,
      nextRepeat: pack.nextRepeat ?? undefined,
    }))

    const dashboard: ProfileDashboard = {
      user: user ? { login: user.login, createdAt: user.createdAt } : null,
      dueCount,
      learningCount,
      inProgressCount,
      fullyLearnedCount,
      lastTraining,
      levelDistribution,
      stageDistribution,
      packs,
    }

    return dashboard
  } catch (e) {
    ErrorHandler(e)
  }
})
