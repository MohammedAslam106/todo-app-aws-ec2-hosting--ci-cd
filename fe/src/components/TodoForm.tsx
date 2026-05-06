import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutationTodo, type TodoType } from "../hooks/useTodo";
import { useQueryClient } from "@tanstack/react-query";
import { memo } from "react";

interface Inputs {
    title: string,
    description: string
}

// State change → causes render  
// Strict Mode → doubles that render

const TodoForm = memo(({onClose}: {onClose: () => void}) => {
    // console.log('TodoForm is rendered');

    const {mutate: createTodo} = useMutationTodo();

    const queryClient = useQueryClient();

    const {register, handleSubmit, formState: {errors}} = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        createTodo(data, {
            onSuccess: (newData) => {
                alert("Todo created successfully!");

                // ✅ Invalidate the "todos" query to refetch the updated list
                // queryClient.invalidateQueries({ queryKey: ["todos"] });

                // ✅ Alternatively, we can directly update the cache without refetching (Optimistic Update)
                queryClient.setQueryData(["todos"], (oldData: TodoType[] | undefined) => {
                    if (!oldData) return [newData]; // If no todos, start with the new one
                    return [...oldData, newData]; // Otherwise, add the new todo to the existing list
                });

                onClose();
            },

            onError: (error) => {
                console.error("Error creating todo:", error);
                alert("Failed to create todo. Please try again.");
            }
        });
    }

    return(
        <form className=' w-full px-4 py-6 flex flex-col justify-around items-center gap-4 ' onSubmit={handleSubmit(onSubmit)}>

            <div className=" w-full flex flex-col justify-center items-start gap-2">
                <label htmlFor="title" className=' block text-gray-700 font-semibold mb-2'>Title</label>
                <input type="text" {...register("title", { required: true })} id="title" className=' w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />

                {
                    errors.title && <span className=' text-red-500 text-sm'>Title is required</span>
                }
            </div>

            <div className=" w-full flex flex-col justify-center items-start gap-2">
                <label htmlFor="description" className=' block text-gray-700 font-semibold mb-2'>Description</label>
                <input type="text" {...register("description", { required: true })} id="description" className=' w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                {
                    errors.description && <span className=' text-red-500 text-sm'>Description is required</span>
                }
            </div>

            <button className=' bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'>Create</button>
        </form>
    )
});

export default TodoForm;