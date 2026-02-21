import axiosInstance from "./axios";
import { API } from "./endpoints";

export const createReview = async (reviewData: any): Promise<any> => {
    try {
        const response = await axiosInstance.post(API.REVIEW.CREATE, reviewData);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to submit review"
        );
    }
}

export const fetchUserReviews = async (userId: string, page = 1, limit = 10): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.REVIEW.GET_BY_USER(userId), {
            params: { page, limit }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch reviews"
        );
    }
}
