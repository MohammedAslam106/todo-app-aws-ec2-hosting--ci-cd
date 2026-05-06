import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
// import { UseAuth } from "../context/AuthContext";
// import { useEffect } from "react";

export function useCurrentUser() {
    // const { setCurrentUser } = UseAuth();
    const query = useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await api.get("/v1/users/me");

            if (res.status !== 200) {
                throw new Error("Not authenticated"); // ✅
            }

            // console.log("data", res.data.data)

            return res.data.data;
        },
        // 🔥 IMPORTANT FIXES
        retry: false,                 // ❌ stop infinite retries
        refetchOnWindowFocus: false, // optional
        refetchOnMount: false,       // optional
        staleTime: 5 * 60 * 1000,    // cache for 5 mins
    });

    return query;
}