import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user.schema.js";


export const refreshTokenTable = pgTable('refresh_tokens',  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId').notNull().references(()=>userTable.id),
    refreshToken: text('refreshToken').notNull(),
    expiresAt: date('expiresAt').notNull(),
    createdAt: date('createdAt').notNull().defaultNow(),
    updatedAt: date('updatedAt').notNull().defaultNow(),
});