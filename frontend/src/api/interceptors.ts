import { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Function to attach request and response interceptors to an Axios instance
export const setupInterceptors = (instance: AxiosInstance): void => {
    // Request interceptor: Attach JWT token if available
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: AxiosError) => {
            // Simply reject on request errors (e.g., network issues)
            return Promise.reject(error);
        }
    );

    // Response interceptor: Handle global errors, with special case for auth
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            // Pass through successful responses
            return response;
        },
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                // Skip handling if this is a login or register request (prevents reload on auth failure)
                const url = error.config?.url;
                if (url?.includes('/users/login') || url?.includes('/users/register')) {
                    // Let the error propagate to the calling component for local handling
                    return Promise.reject(error);
                }

                // For other 401s (e.g., expired token): Logout and redirect
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                // Use window.location for redirect (avoids React Router issues in non-component code)
                if (globalThis.location.pathname !== '/login') {
                    globalThis.location.href = '/login';
                }
            }

            // Reject for all other errors (handled by calling components)
            return Promise.reject(error);
        }
    );
};