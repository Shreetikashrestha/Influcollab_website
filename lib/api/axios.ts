import axios from 'axios';
// Removed broken type import
import { getAuthToken } from '../cookie';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

const axiosInstance = axios.create(
    {
        baseURL: BASE_URL,
        timeout: 15000, // 15 second timeout to prevent ECONNABORTED hanging
        headers: {
            'Content-Type': 'application/json',
        }
    }
)
axiosInstance.interceptors.request.use(
    async (config: any) => {
        const token = await getAuthToken();
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: any) => {
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('Request timed out. Please check if the backend server is running.'));
        }
        if (error.code === 'ERR_NETWORK' || !error.response) {
            return Promise.reject(new Error('Cannot reach server. Please ensure the backend is running on port 5050.'));
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;