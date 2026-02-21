import axiosInstance from "./axios";
import { API } from "./endpoints";

export const fetchNotifications = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.NOTIFICATION.LIST);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch notifications");
    }
}

export const fetchUnreadNotificationCount = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(API.NOTIFICATION.UNREAD);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch unread count");
    }
}

export const markNotificationAsRead = async (notificationId: string): Promise<any> => {
    try {
        const response = await axiosInstance.patch(API.NOTIFICATION.READ(notificationId));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to mark as read");
    }
}

export const markAllNotificationsAsRead = async (): Promise<any> => {
    try {
        const response = await axiosInstance.patch(API.NOTIFICATION.MARK_ALL_READ);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to mark all as read");
    }
}

export const deleteNotification = async (notificationId: string): Promise<any> => {
    try {
        const response = await axiosInstance.delete(API.NOTIFICATION.DELETE(notificationId));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to delete notification");
    }
}
