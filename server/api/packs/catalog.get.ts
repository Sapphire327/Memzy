import { and, db, eq, or, tables } from '#server/database/utils/database'
import { desc, exists, ilike, inArray, sql } from 'drizzle-orm'
import type { CatalogPack, Pack } from '#shared/schemas'
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
      })
    }

    const query = getQuery(event)
    const search = typeof query.search === 'string' ? query.search.trim() : ''
    const page = Math.max(1, parseInt(String(query.page)) || 1)
    const pageSize = Math.max(1, parseInt(String(query.pageSize)) || 12)

    const filters = [eq(tables.packs.isPublic, true)]
    if (search) {
      filters.push(or(
        ilike(tables.packs.name, `%${search}%`),
        ilike(tables.packs.description, `%${search}%`),
        exists(
          db.select({ id: tables.packsTags.id })
            .from(tables.packsTags)
            .innerJoin(tables.tags, eq(tables.packsTags.tagId, tables.tags.id))
            .where(and(
              eq(tables.packsTags.packId, tables.packs.id),
              ilike(tables.tags.name, `%${search}%`)
            ))
        )
      ))
    }
    const where = and(...filters)

    const [countRow] = await db.select({ count: sql`count(*)`.mapWith(Number) })
      .from(tables.packs)
      .where(where)
    const total = countRow?.count ?? 0

    const packs = await db.query.packs.findMany({
      where,
      orderBy: desc(tables.packs.id),
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })

    const packIds = packs.map((pack) => pack.id)

    const tagsMap = await getPacksTags(packIds)

    const subRows = packIds.length
      ? await db.select({ packId: tables.packsUsersSubscribe.packId })
        .from(tables.packsUsersSubscribe)
        .where(and(
          inArray(tables.packsUsersSubscribe.packId, packIds),
          eq(tables.packsUsersSubscribe.userId, session.user.id)
        ))
      : []
    const subscribedSet = new Set(subRows.map((row) => row.packId))

    const result: CatalogPack[] = packs.map((pack): Pack => ({
      id: pack.id,
      name: pack.name,
      description: pack.description,
      isPublic: pack.isPublic || false,
      tags: tagsMap.get(pack.id) ?? [],
      authorId: pack.authorId,
    })).map((pack) => ({
      ...pack,
      isSubscribed: subscribedSet.has(pack.id),
    }))

    return { packs: result, total, page, pageSize }
  } catch (e) {
    ErrorHandler(e)
  }
})
