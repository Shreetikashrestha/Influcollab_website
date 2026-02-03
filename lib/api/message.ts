import axiosInstance from "./axios";
import { API } from "./endpoints";

export const fetchMessages = async () => {
    try {
        const response = await axiosInstance.get(API.MESSAGE.LIST);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch messages"
        };
    }
}

export const fetchChat = async (userId: string) => {
    try {
        const response = await axiosInstance.get(API.MESSAGE.CHAT(userId));
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch chat"
        };
    }
}

export const sendMessage = async (userId: string, content: string) => {
    try {
        const response = await axiosInstance.post(API.MESSAGE.CHAT(userId), { content });
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to send message"
        };
    }
}
