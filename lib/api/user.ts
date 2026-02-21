//backend api call only
import axios from "./axios";
import { API } from "./endpoints";

/**
 * Update authenticated user's profile
 * @param id - User ID (should match authenticated user)
 * @param formData - FormData object containing updated profile data and optional profile picture
 */
export const updateMyProfile = async (id: string, formData: FormData) => {
    try {
        const response = await axios.put(
            API.AUTH.UPDATE_PROFILE,
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
            || "Failed to update profile"
        );
    }
};

export const searchUsersForMessaging = async (query: string) => {
    try {
        const response = await axios.get(API.AUTH.SEARCH_MESSAGING, {
            params: { q: query }
        });
        return response.data;
    } catch (err: any) {
        throw new Error(
            err.response?.data?.message || err.message || "Failed to search users"
        );
    }
};
