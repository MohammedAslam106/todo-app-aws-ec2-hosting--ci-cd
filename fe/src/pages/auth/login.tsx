import { Link, Navigate,  } from "react-router";
// import { UseAuth } from "../../context/AuthContext";
import {useForm, type SubmitHandler} from 'react-hook-form';
// import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";

interface Inputs {
    email: string,
    password: string
}

export default function Login( ){
    // const {currentUser} = UseAuth();
    // const {isLoading, data: currentUser} = useCurrentUser();

    const queryClient = useQueryClient();

    const currentUser = queryClient.getQueryData(["me"]);

    const {register, handleSubmit, formState: {errors}} = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await fetch('/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const userData = await response.json();

            // localStorage.setItem("currentUser", JSON.stringify(userData.data.user));
            // setCurrentUser(userData.data.user);

            // ✅ Instead of setCurrentUser
            queryClient.setQueryData(["me"], userData.data.user);
        } catch (error) {
            console.error("Login error:", error);

            alert("Login failed. Please check your credentials and try again.");
        }
    }

    if(currentUser){
        return <Navigate to='/' />
    }

    return(
        <div className=" w-full h-screen flex justify-center items-center">
            <div className=" w-full flex flex-col justify-between gap-5 items-center px-4 py-4 bg-black/50 shadow-md rounded-xl max-w-md mx-auto ">
                <h1 className="text-md font-bold mb-0">Login</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full h-full max-w-sm mt-5">
                    <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("email", { required: true })} />

                    {
                        errors.email && <span className="text-red-500 text-sm">Email is required</span>
                    }

                    <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("password", { required: true })} />
                    {
                        errors.password && <span className="text-red-500 text-sm">Password is required</span>
                    }
                    <button type="submit" className="w-full px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Login</button>

                    <Link to='/signup' className="text-sm text-gray-400 hover:text-gray-200 mt-2">Don't have an account? Signup</Link>
                </form>
            </div>
        </div>
    )
}