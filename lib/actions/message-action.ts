"use server";

import { fetchMessages, fetchChat, sendMessage } from "../api/message";
import { revalidatePath } from "next/cache";

export const handleFetchMessages = async () => {
    return await fetchMessages();
}

export const handleFetchChat = async (userId: string) => {
    return await fetchChat(userId);
}

export const handleSendMessage = async (userId: string, content: string) => {
    const result = await sendMessage(userId, content);
    if (result.success) {
        revalidatePath(`/messages/${userId}`);
        revalidatePath("/messages");
    }
    return result;
}
