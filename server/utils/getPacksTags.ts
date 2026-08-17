import { db, eq, tables } from '#server/database/utils/database'
import { inArray } from 'drizzle-orm'

export default async function getPacksTags(packIds: number[]): Promise<Map<number, { id: number, name: string }[]>> {
  const map = new Map<number, { id: number, name: string }[]>()
  if (!packIds.length) return map

  const rows = await db.select({
    packId: tables.packsTags.packId,
    id: tables.tags.id,
    name: tables.tags.name,
  })
    .from(tables.packsTags)
    .innerJoin(tables.tags, eq(tables.packsTags.tagId, tables.tags.id))
    .where(inArray(tables.packsTags.packId, packIds))

  for (const row of rows) {
    const list = map.get(row.packId) ?? []
    list.push({ id: row.id, name: row.name })
    map.set(row.packId, list)
  }
  return map
}
