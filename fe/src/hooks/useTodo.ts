import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface TodoType {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export function useTodo() {
    return useQuery<TodoType[], Error, TodoType[], ["todos"]>({
        queryKey: ["todos"],
        queryFn: async () => {
            const res = await api.get("/v1/todos");

            if (res.status !== 200) {
                throw new Error("Failed to fetch todos");
            }

            // console.log("Fetched todos:", res.data.todos);

            return res.data.todos;
        },
        // retry: false,                 // ❌ stop infinite retries
        // refetchOnWindowFocus: false, // optional
        // refetchOnMount: false,       // optional
        // staleTime: 5 * 60 * 1000,    // cache for 5 mins
    })
}

export function useMutationTodo() {
    return useMutation<Partial<TodoType>, Error, { title: string; description: string }>({
        mutationKey: ["todos"],
        mutationFn: async (data: { title: string; description: string }) => {
            const res = await api.post("/v1/todos/todo", data);

            if (res.status !== 201) {
                throw new Error("Failed to create todo");
            }

            console.log("Created todo:", res.data.todo);

            return res.data.todo;
        },
    })
}

export function useUpdateTodo() {
    return useMutation<Partial<TodoType>, Error, { id: string; title?: string; description?: string; completed?: boolean }>({
        mutationKey: ["todos"],
        mutationFn: async (data: { id: string; title?: string; description?: string; completed?: boolean }) => {
            const res = await api.put(`/v1/todos/todo/${data.id}`, data);

            if (res.status !== 200) {
                throw new Error("Failed to update todo");
            }

            console.log("Updated todo:", res.data.todo);

            return res.data.todo;
        },
    })
}

export function useDeleteTodo() {
    return useMutation<{ success: boolean; message: string }, Error, { id: string }>({
        mutationKey: ["todos"],
        mutationFn: async (data: { id: string }) => {
            const res = await api.delete(`/v1/todos/todo/${data.id}`);

            if (res.status !== 200) {
                throw new Error("Failed to delete todo");
            }

            return res.data.data;
        },
    })
}