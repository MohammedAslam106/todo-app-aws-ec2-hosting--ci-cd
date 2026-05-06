import { todoServices } from "../services/todo.service.js";
import { AuthenticatedRequest } from "../types/extends.js";
import { Response } from "express";


export class TodoController {
    constructor() {};

    async createTodo(req: AuthenticatedRequest, res: Response) {
        try {
            const { title, description } = req.body;

            const result = await todoServices.createTodo(title, description, req.user!.id);
            res.status(201).json(result);
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getTodoById(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            if(!id) {
                res.status(400).json({ success: false, message: "Todo ID is required" });
                return;
            }

            const result = await todoServices.getTodoById(id as string);
            res.status(200).json(result);
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAllTodosOfCurrentUser(req: AuthenticatedRequest, res: Response) {
        try {
            const result = await todoServices.getAllTodosOfCurrentUser(req.user!.id);
            res.status(200).json(result);
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateTodoById(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            // console.log("Received request to update todo with ID:", id);
            // console.log("Request body:", req.body);

            if(id.toString() === 'undefined') {
                res.status(400).json({ success: false, message: "Todo ID is required" });
                return;
            }

            const updateData = req.body;
            const result = await todoServices.updateTodoById(id as string, updateData);
            res.status(200).json(result);
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async deleteTodoById(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            if(!id) {
                res.status(400).json({ success: false, message: "Todo ID is required" });
                return;
            }

            const result = await todoServices.deleteTodoById(id as string);
            res.status(200).json(result);
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

}

export const todoController = new TodoController();