import { and, db, eq, not, tables } from '#server/database/utils/database'
import { inArray } from 'drizzle-orm'

export default async function getAccessiblePackIds(userId: number): Promise<number[]> {
  const ownPacks = await db.select({ id: tables.packs.id })
    .from(tables.packs)
    .where(eq(tables.packs.authorId, userId))

  const subscriptions = await db.select({ packId: tables.packsUsersSubscribe.packId })
    .from(tables.packsUsersSubscribe)
    .where(eq(tables.packsUsersSubscribe.userId, userId))
  const subscribedPackIds = subscriptions.map((subscription) => subscription.packId)

  const subscribedPacks = subscribedPackIds.length
    ? await db.select({ id: tables.packs.id })
        .from(tables.packs)
        .where(and(
          inArray(tables.packs.id, subscribedPackIds),
          eq(tables.packs.isPublic, true),
          not(eq(tables.packs.authorId, userId))
        ))
    : []

  return [...new Set([
    ...ownPacks.map((pack) => pack.id),
    ...subscribedPacks.map((pack) => pack.id),
  ])]
}
