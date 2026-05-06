import { useQueryClient } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router'


export default function ProtectedRoute( ){
    const queryClient = useQueryClient();
    const currentUser = queryClient.getQueryData(["me"]);

    // console.log("ProtectedRoute currentUser", currentUser);

    if(!currentUser) {
        return <Navigate to='/login' />
    }

    return <Outlet />;
}