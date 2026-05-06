import { useMutation } from "@tanstack/react-query"
import { api } from "../lib/api"


export default function LogoutButton( ){
    const {isPending, mutate} = useMutation({
        mutationKey: ["logout"],
        mutationFn: async () => {
            const res = await api.post("/v1/users/logout", {}, { withCredentials: true });

            if (res.status !== 200) {
                throw new Error("Logout failed");
            }

            return res.data;
        },
        onSuccess: () => {
            // console.log("Logout successful");
            window.location.href = "/login"; // Redirect to login page after logout
        }
    })

    return(
        <button onClick={() => mutate()} className=' fixed bottom-5 left-5 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600'>
            { isPending ? 'Logging out...' : 'Logout'}
        </button>
    )
}