import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTodo, useUpdateTodo, type TodoType } from "../hooks/useTodo";

interface TodoProps{
    title: string;
    description: string;
    id: string;
    completed: boolean;

}

export default function Todo({title, description, id, completed}:TodoProps ){

    // console.log(id);

    const queryClient = useQueryClient();

    const {isPending:isUpdatingTodo, mutate:updateTodo} = useUpdateTodo();

    const {isPending:isDeletingTodo, mutate:deleteTodo} = useDeleteTodo();

    function handleToggle() {

        console.log('Id', id);

        updateTodo({ id, completed: !completed }, {
            onSuccess: (data) => {
                console.log("Todo updated successfully");

                // ✅ Invalidate the "todos" query to refetch the updated list
                // queryClient.invalidateQueries({ queryKey: ["todos"] });

                // ✅ Alternatively, we can directly update the cache without refetching (Optimistic Update)
                queryClient.setQueryData(["todos"], (oldData: TodoType[]) => {
                    if (!oldData) return [];
                    return oldData.map((todo: TodoType) => {
                        if (todo.id === data.id) {
                            return { ...data }; // Update the specific todo with the new data
                        }
                        return todo;
                    });
                });
            }

        });
    }

    function handleDelete() {
        deleteTodo({ id }, {
            onSuccess: () => {
                console.log("Todo deleted successfully");
                // ✅ Invalidate the "todos" query to refetch the updated list
                queryClient.invalidateQueries({ queryKey: ["todos"] });
            }
        });
    }

    return(
        <div key={id} className=' bg-white p-4 rounded shadow mb-4 flex justify-between items-center gap-5'>
            <div>
                <h2 className={` text-xl font-semibold ${completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{title}</h2>
                <p className={` text-gray-600 ${completed ? 'line-through' : ''}`}>{description}</p>
            </div>
            <div className=" flex justify-center items-center gap-4">
                <button className=' bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600' onClick={handleToggle}>
                    {isUpdatingTodo ? "Updating..." : 'Toggle'}
                </button>
                <button className=' bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600' onClick={handleDelete}>
                    {isDeletingTodo ? "Deleting..." : 'Delete'}
                </button>
            </div>
        </div>
    )
}