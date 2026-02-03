import axios from 'axios';
// Removed broken type import
import { getAuthToken } from '../cookie';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

const axiosInstance = axios.create(
    {
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    }
)
axiosInstance.interceptors.request.use(
    async (config: any) => {
        const token = await getAuthToken();
        if(token && config.headers){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;