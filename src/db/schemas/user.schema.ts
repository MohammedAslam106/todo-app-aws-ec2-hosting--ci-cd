import { pgTable, uuid, text, date } from "drizzle-orm/pg-core";


export const userTable = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name'),
    createdAt: date('createdAt').notNull().defaultNow(),
    updatedAt: date('updatedAt').notNull().defaultNow(),
})

export type User = typeof userTable.$inferSelect;