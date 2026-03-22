import { bigint, boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: bigint({mode:'number'}).primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  email:varchar({ length: 254 }).notNull().unique(),
  hasActivated:boolean().default(false).notNull(),
  passwordHash: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
export const tags = pgTable("tags",{
   id: bigint({mode:'number'}).primaryKey().generatedByDefaultAsIdentity(),
  name:varchar({length:50}).notNull().unique(),
})
export const packs = pgTable("packs",{
  id: bigint({mode:'number'}).primaryKey().generatedByDefaultAsIdentity(),
  name:varchar({length:100}).notNull(),
  description:varchar({length:100}),
  isPublic:boolean().default(false),
  authorId:  bigint({mode:'number'}).notNull().references(() => users.id),
})
export const packsTags = pgTable("packsTags",{
  id: bigint({mode:'number'}).primaryKey().generatedByDefaultAsIdentity(),
  packId: bigint({mode:'number'}).notNull().references(() => packs.id),
  tagId:  bigint({mode:'number'}).notNull().references(() => tags.id),
})
export const quests = pgTable("quest",{
  id: bigint({mode:'number'}).primaryKey().generatedByDefaultAsIdentity(),
  quest:text(),
  questImgName:text(),
  answer:text(),
  answerImgName:text(),
  hint:text(),
  exampleInText:text(),
  packId:  bigint({mode:'number'}).notNull().references(() => packs.id),
})