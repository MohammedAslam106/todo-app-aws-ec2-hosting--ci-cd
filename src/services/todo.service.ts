import { eq } from "drizzle-orm";
import { db } from "../db/connection.js";
import { todoSchema } from "../db/schemas/todo.schema.js";


export class TodoServices {
    constructor() {};

    async createTodo(title: string, description: string, userId: string) {
        try {
            const result = await db.insert(todoSchema).values({
                title,
                description,
                userId
            }).returning();

            return {
                success: true,
                message: "Todo created successfully",
                todo: result[0]
            };
        } catch (error:any) {
            throw new Error(error.message || "Error creating todo");
        }
    }

    async getTodoById(id: string) {
        try {
            const result = await db.select().from(todoSchema).where(eq(todoSchema.id, id));

            if(result.length === 0) {
                throw new Error("Todo not found");
            }
            return {
                success: true,
                message: "Todo fetched successfully",
                todo: result[0]
            };
        } catch (error:any) {
            throw new Error(error.message || "Error fetching todo by ID");
        }
    }

    async getAllTodosOfCurrentUser(userId: string) {
        try {
            const result = await db.select().from(todoSchema).where(eq(todoSchema.userId, userId));

            // console.log("Fetched todos for user:", userId, result);

            return {
                success: true,
                message: "Todos fetched successfully",
                todos: result
            };
        } catch (error:any) {
            throw new Error(error.message || "Error fetching todos for the current user");
        }
    }

    async updateTodoById(id: string, updateData: { title?: string; description?: string; completed?: boolean }) {
        try {

            const result = await db.update(todoSchema).set(updateData).where(eq(todoSchema.id, id)).returning();

            if(result.length === 0) {
                throw new Error("Todo not found");
            }
            return {
                success: true,
                message: "Todo updated successfully",
                todo: result[0]
            };
        } catch (error:any) {
            throw new Error(error.message || "Error updating todo by ID");
        }
    }

    async deleteTodoById(id: string) {
        try {
            const result = await db.delete(todoSchema).where(eq(todoSchema.id, id)).returning();

            if(result.length === 0) {
                throw new Error("Todo not found");
            }
            return {
                success: true,
                message: "Todo deleted successfully",
                todo: result[0]
            };
        } catch (error:any) {
            throw new Error(error.message || "Error deleting todo by ID");
        }
    }
}

export const todoServices = new TodoServices();