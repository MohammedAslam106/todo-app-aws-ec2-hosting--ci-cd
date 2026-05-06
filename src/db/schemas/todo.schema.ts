import { boolean, date, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user.schema.js";


export const todoSchema = pgTable('todos', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description'),
    completed: boolean('completed').notNull().default(false),
    userId: uuid('userId').notNull().references(()=> userTable.id),
    createdAt: date('createdAt').notNull().defaultNow(),
    updatedAt: date('updatedAt').notNull().defaultNow(),
});

export type Todo = typeof todoSchema.$inferSelect;