import { useCallback, useState } from 'react'
import Todo from '../components/Todo';
import TodoForm from '../components/TodoForm';
import { X } from 'lucide-react'
import { useTodo} from '../hooks/useTodo';
import LogoutButton from '../components/LogoutButton';
// import { useCurrentUser } from '../hooks/useCurrentUser';

function Home() {

    console.log('Home is rendered');

    const {isLoading, data: todosData} = useTodo();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = useCallback(() => {
        setIsModalOpen(prev => !prev);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className={`flex w-full justify-center items-center h-screen  ${isModalOpen ? 'blur-sm bg-black/25' : ''}`}>
                <div>
                    <h1 className=' text-4xl font-bold text-gray-800'>Full Stack Todo App</h1>

                    <div>
                        {todosData?.map(todo => (
                            <Todo key={todo.id} title={todo.title} description={todo.description} id={todo.id} completed={todo.completed} />
                        ))}
                    </div>
                </div>

                <button onClick={toggleModal} className=' fixed bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600'>Create Todo</button>

                <LogoutButton />
            </div>

            {
                isModalOpen &&
                <div className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-auto flex flex-col justify-center items-center bg-white h-1/2 rounded-md shadow-sm px-2 py-4'>
                    <button onClick={toggleModal} className=' absolute top-5 right-5 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'>
                        <X size={18} />
                    </button>

                    <h1>
                        Create Todo
                    </h1>

                    <TodoForm onClose={toggleModal} />
                </div>
            }
        </>
    )
}

export default Home
