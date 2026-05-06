

import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { todoController } from "../controllers/todo.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/todo", async (req, res) => todoController.createTodo(req, res) );

router.get("/todo/:id", async (req, res) => todoController.getTodoById(req, res) );

router.get("/", async (req, res) => todoController.getAllTodosOfCurrentUser(req, res) );

router.put("/todo/:id", async (req, res) => todoController.updateTodoById(req, res) );

router.delete("/todo/:id", async (req, res) => todoController.deleteTodoById(req, res) );

export default router;