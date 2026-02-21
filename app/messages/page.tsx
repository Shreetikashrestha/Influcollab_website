"use client";

import React, { useState, useEffect } from 'react';
import { ConversationsList } from './ConversationsList';
import { ChatArea } from './ChatArea';
import { fetchConversations, fetchConversationMessages, sendMessage, markMessageAsRead } from '@/lib/api/message';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { MessageSquare, UserCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import { useSearchParams } from 'next/navigation';
import { searchUsersForMessaging } from '@/lib/api/user';

export default function MessagesPage() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const searchParams = useSearchParams();
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        const initializeMessages = async () => {
            await loadConversations();

            const userIdParam = searchParams.get('userId');
            if (userIdParam) {
                try {
                    // We can reuse searchUsersForMessaging but maybe we need a direct getUserById?
                    // For now, let's search and find the exact match or just fetch user details if possible.
                    // Actually, if we have the ID, we might need a fetchUserById.
                    // Let's assume searchUsersForMessaging can take a specific ID or we just search.
                    // Better yet, let's just use the search API with the exact query if it was username, 
                    // but here it's ID. 
                    // Let's use searchUsersForMessaging(userIdParam) and filter.
                    const res = await searchUsersForMessaging(userIdParam) as any;
                    if (res.success && res.data.length > 0) {
                        const targetUser = res.data.find((u: any) => u._id === userIdParam);
                        if (targetUser) {
                            handleStartNewChat(targetUser);
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch user for direct message:", err);
                }
            }
        };
        initializeMessages();
    }, [searchParams]);

    useEffect(() => {
        if (activeConversationId) {
            loadMessages(activeConversationId);
            import('@/lib/api/message').then(m => m.markConversationAsRead(activeConversationId))
                .then(() => loadConversations())
                .catch(console.error);
        }
    }, [activeConversationId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_message', (message: any) => {
            if (message.conversationId === activeConversationId) {
                setMessages(prev => [...prev, message]);
                if (activeConversationId) {
                    import('@/lib/api/message').then(m => m.markConversationAsRead(activeConversationId))
                        .catch(console.error);
                }
            }

            // Refresh conversations list to update last message and unread count
            loadConversations();
        });

        socket.on('messages_read', (data: any) => {
            if (data.conversationId === activeConversationId) {
                // Could update message UI to show seen status
            }
            loadConversations();
        });

        return () => {
            socket.off('new_message');
            socket.off('messages_read');
        };
    }, [socket, activeConversationId]);

    const loadConversations = async () => {
        try {
            const data = await fetchConversations();
            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (id: string) => {
        try {
            const data = await fetchConversationMessages(id);
            if (data.success) {
                setMessages(data.messages);
                socket?.emit('join_conversation', id);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleStartNewChat = (user: any) => {
        // Check if conversation already exists
        const existing = conversations.find(c =>
            c.participants.some((p: any) => p.user._id === user._id)
        );

        if (existing) {
            setActiveConversationId(existing._id);
            setSelectedUser(null);
        } else {
            setActiveConversationId(null);
            setSelectedUser(user);
            setMessages([]);
        }
    };

    const handleSendMessage = async (content: string) => {
        try {
            let data;
            if (activeConversationId) {
                data = await sendMessage({
                    conversationId: activeConversationId,
                    content
                });
            } else if (selectedUser) {
                data = await sendMessage({
                    receiverId: selectedUser._id,
                    content
                });
                if (data.success) {
                    // Refresh conversations to get the new ID
                    await loadConversations();
                    setActiveConversationId(data.message.conversationId);
                    setSelectedUser(null);
                }
            }

            if (data?.success) {
                // message will come back via socket
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const activeConversation = conversations.find(c => c._id === activeConversationId);

    // Create a virtual conversation object for a new chat
    const virtualConversation = selectedUser ? {
        _id: 'new',
        participants: [
            { user: { _id: user?._id, fullName: user?.fullName, profilePicture: user?.profilePicture } },
            { user: { _id: selectedUser._id, fullName: selectedUser.fullName, profilePicture: selectedUser.profilePicture } }
        ]
    } : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto h-[calc(100vh-120px)] bg-white rounded-2xl shadow-xl border border-gray-100 flex overflow-hidden">
            <div className="w-1/3 lg:w-1/4 border-r border-gray-100 min-w-[300px]">
                <ConversationsList
                    conversations={conversations}
                    currentUserId={user?._id || ''}
                    onSelect={(id) => {
                        setActiveConversationId(id);
                        setSelectedUser(null);
                    }}
                    onStartNewChat={handleStartNewChat}
                    activeId={activeConversationId || undefined}
                />
            </div>

            <div className="flex-1 bg-gray-50/10">
                {(activeConversationId || selectedUser) ? (
                    <ChatArea
                        conversation={activeConversation || virtualConversation}
                        messages={messages}
                        currentUserId={user?._id || ''}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Message</h2>
                        <p className="text-gray-500 max-w-sm">
                            Choose a conversation from the list to start chatting. You can also start new chats from campaign details.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
