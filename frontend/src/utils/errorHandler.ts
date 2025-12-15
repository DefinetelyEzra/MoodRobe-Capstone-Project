import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api.types';

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ApiErrorResponse>;

        // Handle validation errors
        if (axiosError.response?.data?.errors && Array.isArray(axiosError.response.data.errors)) {
            return axiosError.response.data.errors.map((e) => e.msg).join(', ');
        }

        // Handle general error messages
        if (axiosError.response?.data?.error) {
            return axiosError.response.data.error;
        }

        // Handle network errors
        if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ERR_NETWORK') {
            return 'Unable to connect to server. Please check your connection.';
        }

        // Handle timeout
        if (axiosError.code === 'ETIMEDOUT') {
            return 'Request timed out. Please try again.';
        }

        // Handle specific status codes
        switch (axiosError.response?.status) {
            case 401:
                return 'Invalid email or password. Please try again.';
            case 409:
                return 'An account with this email already exists.';
            case 404:
                return 'Account not found. Please check your email.';
            case 500:
                return 'Server error. Please try again later.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
};