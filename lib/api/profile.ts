import axiosInstance from "./axios";
import { API } from "./endpoints";

export const fetchMyProfile = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.PROFILES.ME);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch profile");
    }
}

export const fetchUserProfile = async (userId: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.PROFILES.GET(userId));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch user profile");
    }
}

export const updateProfile = async (profileData: any): Promise<any> => {
    try {
        const response = await axiosInstance.patch(API.PROFILES.UPDATE, profileData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update profile");
    }
}

/**
 * Update profile with optional file upload (logo/profile picture).
 * Sends as multipart/form-data so the backend's multer middleware can receive the file.
 */
export const updateProfileWithImage = async (profileData: any, logoFile?: File): Promise<any> => {
    try {
        const formData = new FormData();

        // Append all text fields
        Object.entries(profileData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        // Append file if provided
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        const response = await axiosInstance.patch(API.PROFILES.UPDATE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update profile");
    }
}
