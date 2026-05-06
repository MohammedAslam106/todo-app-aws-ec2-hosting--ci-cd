// lib/api.ts
import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve();
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            isRefreshing = true;

            try {
                await axios.post(
                    "/api/v1/users/refresh-token",
                    {},
                    { withCredentials: true }
                );

                processQueue(null);

                return api(originalRequest);
            } catch (err) {
                processQueue(err);

                // 🔥 logout globally
                // window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);