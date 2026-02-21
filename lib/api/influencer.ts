import axiosInstance from "./axios";
import { API } from "./endpoints";

export const fetchInfluencers = async (filters: { niche?: string; category?: string; search?: string } = {}) => {
    try {
        const response = await axiosInstance.get(API.PROFILES.INFLUENCERS, { params: filters });
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch influencers"
        );
    }
};
