"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { ConversationsList } from './ConversationsList';
import { ChatArea } from './ChatArea';
import { fetchConversations, fetchConversationMessages, sendMessage, markMessageAsRead, markConversationAsRead } from '@/lib/api/message';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { MessageSquare, UserCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import { useSearchParams } from 'next/navigation';
import { searchUsersForMessaging } from '@/lib/api/user';

function MessagesPageContent() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const searchParams = useSearchParams();
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState<any>(null);

    const currentUserId = user?._id || user?.id || user?.userId || '';

    useEffect(() => {
        const initializeMessages = async () => {
            await loadConversations();

            const userIdParam = searchParams.get('userId');
            if (userIdParam) {
                try {
                    const res = await searchUsersForMessaging(userIdParam) as any;
                    if (res.success && res.data.length > 0) {
                        const targetUser = res.data.find((u: any) => u._id === userIdParam);
                        if (targetUser) {
                            handleStartNewChat(targetUser);
                        }
                    }
                } catch (err) {
                    // Silently fail - user can manually search
                }
            }
        };
        initializeMessages();
    }, [searchParams]);

    useEffect(() => {
        if (activeConversationId) {
            loadMessages(activeConversationId);
            markConversationAsRead(activeConversationId)
                .then(() => loadConversations())
                .catch(() => {
                    // Silently fail - not critical
                });
        }
    }, [activeConversationId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_message', (message: any) => {
            if (message.conversationId === activeConversationId) {
                setMessages(prev => {
                    const exists = prev.some(m => m._id === message._id);
                    if (exists) return prev;
                    return [...prev, message];
                });
                
                if (activeConversationId) {
                    markConversationAsRead(activeConversationId).catch(() => {});
                }
            }

            loadConversations();
        });

        socket.on('messages_read', (data: any) => {
            if (data.conversationId === activeConversationId) {
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

    const handleStartNewChat = (targetUser: any) => {
        const existing = conversations.find(c =>
            c.participants.some((p: any) => p.user._id === targetUser._id)
        );

        if (existing) {
            setSelectedUser(null);
            setActiveConversationId(existing._id);
            loadMessages(existing._id);
        } else {
            setActiveConversationId(null);
            setSelectedUser(targetUser);
            setMessages([]);
        }
    };

    const handleSendMessage = async (content: string, attachments?: File[]) => {
        try {
            let data;
            if (activeConversationId) {
                if (attachments && attachments.length > 0) {
                    const formData = new FormData();
                    formData.append('content', content);
                    formData.append('conversationId', activeConversationId);
                    attachments.forEach(file => {
                        formData.append('attachments', file);
                    });
                    data = await sendMessage(formData as any);
                } else {
                    data = await sendMessage({
                        conversationId: activeConversationId,
                        content
                    });
                }
            } else if (selectedUser) {
                if (attachments && attachments.length > 0) {
                    const formData = new FormData();
                    formData.append('content', content);
                    formData.append('receiverId', selectedUser._id);
                    attachments.forEach(file => {
                        formData.append('attachments', file);
                    });
                    data = await sendMessage(formData as any);
                } else {
                    data = await sendMessage({
                        receiverId: selectedUser._id,
                        content
                    });
                }
                if (data.success) {
                    await loadConversations();
                    setActiveConversationId(data.message.conversationId);
                    setSelectedUser(null);
                }
            }

            if (data?.success) {
                setMessages(prev => {
                    const exists = prev.some(m => m._id === data.message._id);
                    if (exists) return prev;
                    return [...prev, data.message];
                });
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to send message');
        }
    };

    const activeConversation = conversations.find(c => c._id === activeConversationId);

    const virtualConversation = selectedUser ? {
        _id: 'new',
        participants: [
            { user: { _id: currentUserId, fullName: user?.fullName, profilePicture: user?.profilePicture } },
            { user: { _id: selectedUser._id, fullName: selectedUser.fullName, profilePicture: selectedUser.profilePicture } }
        ]
    } : null;

    const conversationToShow = activeConversation || virtualConversation;
    const shouldShowChat = !!(activeConversationId || selectedUser);

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
                    currentUserId={currentUserId}
                    onSelect={(id) => {
                        setActiveConversationId(id);
                        setSelectedUser(null);
                    }}
                    onStartNewChat={handleStartNewChat}
                    activeId={activeConversationId || undefined}
                />
            </div>

            <div className="flex-1 bg-gray-50/10">
                {shouldShowChat && conversationToShow ? (
                    <ChatArea
                        conversation={conversationToShow}
                        messages={messages}
                        currentUserId={currentUserId}
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

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
            <MessagesPageContent />
        </Suspense>
    );
}
