import { db, eq, tables } from '#server/database/utils/database'
import type { UsersPack } from '#shared/schemas'
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
      });
    }
    const userPacks = await db.query.packs.findMany({
      where: eq(tables.packs.authorId, session.user.id)
    });
    const packsWithTags: UsersPack[] = await Promise.all(
      userPacks.map(async (pack) => {
        const tags = await db
          .select({ id: tables.tags.id, name: tables.tags.name })
          .from(tables.packsTags)
          .innerJoin(tables.tags, eq(tables.packsTags.tagId, tables.tags.id))
          .where(eq(tables.packsTags.packId, pack.id));
        return {
          id: pack.id,
          name: pack.name,
          description: pack.description,
          isPublic: pack.isPublic ?? false,
          tags: tags,
          lastRepeat:undefined
        };
      })
    );
    return { packs: packsWithTags };
  } catch (e) {
    ErrorHandler(e);
  }
});
