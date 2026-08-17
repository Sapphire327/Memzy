import { and, db, eq, not, tables } from '#server/database/utils/database'
import { desc, inArray, max, min } from 'drizzle-orm'
import type { UsersPack } from '#shared/schemas'
import ErrorHandler from '~~/server/utils/ErrorHandler'
import getPacksTags from '~~/server/utils/getPacksTags'

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Ошибка авторизации",
        data: []
      });
    }
    const userId = session.user.id

    const myPacks = await db.query.packs.findMany({
      where: eq(tables.packs.authorId, userId)
    })

    const subscriptions = await db.query.packsUsersSubscribe.findMany({
      where: eq(tables.packsUsersSubscribe.userId, userId)
    })
    const subscribedPackIds = subscriptions.map((subscription) => subscription.packId)
    const subscribedPacks = subscribedPackIds.length
      ? await db.query.packs.findMany({
          where: and(
            inArray(tables.packs.id, subscribedPackIds),
            eq(tables.packs.isPublic, true),
            not(eq(tables.packs.authorId, userId))
          ),
          orderBy: desc(tables.packs.id)
        })
      : []

    const allPackIds = [...myPacks.map((pack) => pack.id), ...subscribedPacks.map((pack) => pack.id)]
    const tagsMap = await getPacksTags(allPackIds)

    const repeatRows = allPackIds.length
      ? await db.select({
          packId: tables.quests.packId,
          lastRepeated: max(tables.questsUsers.lastRepeated),
          nextRepeated: min(tables.questsUsers.NextRepeated),
        })
        .from(tables.quests)
        .innerJoin(tables.questsUsers, and(
          eq(tables.questsUsers.questId, tables.quests.id),
          eq(tables.questsUsers.userId, userId)
        ))
        .where(inArray(tables.quests.packId, allPackIds))
        .groupBy(tables.quests.packId)
      : []
    const repeatMap = new Map<number, { lastRepeated: Date | null, nextRepeated: Date | null }>()
    for (const row of repeatRows) {
      repeatMap.set(row.packId, { lastRepeated: row.lastRepeated, nextRepeated: row.nextRepeated })
    }

    const toUsersPack = (packs: typeof myPacks): UsersPack[] => packs.map((pack) => {
      const repeat = repeatMap.get(pack.id)
      return {
        id: pack.id,
        name: pack.name,
        description: pack.description,
        isPublic: pack.isPublic ?? false,
        tags: tagsMap.get(pack.id) ?? [],
        authorId: pack.authorId,
        lastRepeat: repeat?.lastRepeated ?? undefined,
        nextRepeat: repeat?.nextRepeated ?? undefined,
      }
    })

    return { myPacks: toUsersPack(myPacks), subscribedPacks: toUsersPack(subscribedPacks) };
  } catch (e) {
    ErrorHandler(e);
  }
});
