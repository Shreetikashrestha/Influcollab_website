"use server";

import { fetchMessages, fetchChat, sendMessage } from "../api/message";
import { revalidatePath } from "next/cache";

export const handleFetchMessages = async () => {
    try {
        const result = (await fetchMessages()) as any;
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch messages"
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Failed to fetch messages"
        }
    }
}

export const handleFetchChat = async (userId: string) => {
    try {
        const result = (await fetchChat(userId)) as any;
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch chat"
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Failed to fetch chat"
        }
    }
}

export const handleSendMessage = async (userId: string, content: string) => {
    try {
        const result = (await sendMessage(userId, content)) as any;
        if (result.success) {
            revalidatePath(`/messages/${userId}`);
            revalidatePath("/messages");
            return {
                success: true,
                message: "Message sent successfully",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to send message"
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Failed to send message"
        }
    }
}
