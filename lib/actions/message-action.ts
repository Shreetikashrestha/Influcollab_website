"use server";

import { fetchConversations, fetchConversationMessages, sendMessage } from "../api/message";
import { revalidatePath } from "next/cache";

export const handleFetchMessages = async () => {
    return await fetchConversations();
}

export const handleFetchChat = async (conversationId: string) => {
    return await fetchConversationMessages(conversationId);
}

export const handleSendMessage = async (receiverId: string, content: string) => {
    const result = await sendMessage({ receiverId, content });
    if (result.success) {
        revalidatePath(`/messages/${receiverId}`);
        revalidatePath("/messages");
    }
    return result;
}
