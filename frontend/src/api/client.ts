import axios from 'axios';
import { setupInterceptors } from './interceptors'; 

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Attach interceptors
setupInterceptors(apiClient);

export default apiClient;