import axiosInstance from "./axios";
import { API } from "./endpoints";

export const fetchConversations = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.MESSAGE.LIST);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch conversations");
    }
}

export const fetchConversationMessages = async (conversationId: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.MESSAGE.CHAT(conversationId));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch messages");
    }
}

export const sendMessage = async (messageData: {
    conversationId?: string;
    receiverId?: string;
    content: string;
    campaignId?: string;
}): Promise<any> => {
    try {
        const response = await axiosInstance.post(API.MESSAGE.SEND, messageData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to send message");
    }
}

export const markMessageAsRead = async (messageId: string): Promise<any> => {
    try {
        const response = await axiosInstance.patch(`/messages/${messageId}/read`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to mark as read");
    }
}

export const markConversationAsRead = async (conversationId: string): Promise<any> => {
    try {
        const response = await axiosInstance.patch(`/messages/conversation/${conversationId}/read`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to mark conversation as read");
    }
}
