import { bigint, boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: bigint({mode:'number'}).primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  login:varchar({ length: 50 }).notNull().unique(),
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
export const questsUsers = pgTable("questsUsers",{
  id: bigint({mode:'number'}).primaryKey().generatedByDefaultAsIdentity(),
  questId:  bigint({mode:'number'}).notNull().references(() => quests.id),
  userId:  bigint({mode:'number'}).notNull().references(() => users.id),
  lastRepeated:timestamp(),
  NextRepeated:timestamp(),
  level:integer(),
  stage:integer(),
})
export const packsUsersSubscribe = pgTable("packsUsersSubscribe",{
  id: bigint({mode:'number'}).primaryKey().generatedByDefaultAsIdentity(),
  packId:  bigint({mode:'number'}).notNull().references(() => packs.id),
  userId:  bigint({mode:'number'}).notNull().references(() => users.id),
})
// level - уровень пройденного задание
// 1 - просмотр карточки
// 2 - собрать слово
// 3 - собрать слово
// 4 - написать слово

// stage - уровень повторения
// 1	25 минут
// 2	1 день
// 3	3 дня
// 4	1 неделя
// 5	2 недели
// 6	1 месяц