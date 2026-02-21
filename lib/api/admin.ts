//backend api call only
import axios from "./axios";
import { API } from "./endpoints";

/**
 * Get all users with optional filtering and pagination
 */
export const getAllUsers = async (query?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'admin' | 'user' | 'all';
    isInfluencer?: boolean;
}) => {
    try {
        const params = new URLSearchParams();
        if (query?.page) params.append('page', query.page.toString());
        if (query?.limit) params.append('limit', query.limit.toString());
        if (query?.search) params.append('search', query.search);
        if (query?.role) params.append('role', query.role);
        if (query?.isInfluencer !== undefined) params.append('isInfluencer', query.isInfluencer.toString());

        const response = await axios.get(
            `${API.ADMIN.USERS}?${params.toString()}`
        );
        return response.data;
    } catch (err: Error | any) {
        console.error('getAllUsers API error:', err);
        
        // Return a structured error response
        if (err.code === 'ERR_NETWORK' || err.message?.includes('Cannot reach server')) {
            return {
                success: false,
                message: 'Cannot connect to server. Please ensure the backend is running.',
                users: [],
                total: 0
            };
        }
        
        if (err.response?.status === 401) {
            return {
                success: false,
                message: 'Unauthorized. Please login as admin.',
                users: [],
                total: 0
            };
        }
        
        if (err.response?.status === 403) {
            return {
                success: false,
                message: 'Access denied. Admin privileges required.',
                users: [],
                total: 0
            };
        }
        
        return {
            success: false,
            message: err.response?.data?.message || err.message || "Failed to fetch users",
            users: [],
            total: 0
        };
    }
};

/**
 * Get single user by ID
 */
export const getUserById = async (id: string) => {
    try {
        const response = await axios.get(API.ADMIN.USER_BY_ID(id));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch user"
        );
    }
};

/**
 * Create new user (admin only)
 * @param formData - FormData object containing user data and optional profile picture
 */
export const createUser = async (formData: FormData) => {
    try {
        const response = await axios.post(
            API.ADMIN.CREATE_USER,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to create user"
        );
    }
};

/**
 * Update user by ID (admin only)
 * @param id - User ID
 * @param formData - FormData object containing updated user data and optional profile picture
 */
export const updateUser = async (id: string, formData: FormData) => {
    try {
        const response = await axios.put(
            API.ADMIN.UPDATE_USER(id),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update user"
        );
    }
};

/**
 * Delete user by ID (admin only)
 */
export const deleteUser = async (id: string) => {
    try {
        const response = await axios.delete(API.ADMIN.DELETE_USER(id));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to delete user"
        );
    }
};
