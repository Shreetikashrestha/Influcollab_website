"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { format } from 'date-fns';
import { useSocket } from '@/context/SocketContext';

interface Message {
    _id: string;
    sender: any;
    senderRole: string;
    content: string;
    createdAt: string;
}

interface ChatAreaProps {
    conversation: any;
    messages: Message[];
    currentUserId: string;
    onSendMessage: (content: string) => void;
}

export const ChatArea = ({ conversation, messages, currentUserId, onSendMessage }: ChatAreaProps) => {
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { socket } = useSocket();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        socket.on('typing', (data: any) => {
            if (data.conversationId === conversation?._id && data.userId !== currentUserId) {
                setIsTyping(true);
            }
        });

        socket.on('stop_typing', (data: any) => {
            if (data.conversationId === conversation?._id) {
                setIsTyping(false);
            }
        });

        return () => {
            socket.off('typing');
            socket.off('stop_typing');
        };
    }, [socket, conversation?._id, currentUserId]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
        socket?.emit('stop_typing', { conversationId: conversation._id });
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (e.target.value.length > 0) {
            socket?.emit('typing', { conversationId: conversation._id, userId: currentUserId });
        } else {
            socket?.emit('stop_typing', { conversationId: conversation._id });
        }
    };

    const partner = conversation?.participants.find((p: any) => p.user._id !== currentUserId);

    return (
        <div className="flex flex-col h-full bg-white rounded-r-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-pink-600 font-bold mr-3 overflow-hidden border-2 border-white shadow-sm">
                        {partner?.user?.profilePicture ? (
                            <img src={partner.user.profilePicture} alt={partner.user.fullName} className="w-full h-full object-cover" />
                        ) : (
                            partner?.user?.fullName[0] || '?'
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">{partner?.user?.isInfluencer ? 'Influencer' : (partner?.role === 'brand' || !partner?.user?.isInfluencer) ? 'Brand' : partner?.user?.fullName || 'Select a chat'}</h4>
                        {isTyping ? (
                            <p className="text-xs text-blue-500 font-bold animate-pulse">
                                typing...
                            </p>
                        ) : (
                            <p className="text-xs text-green-500 font-medium flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-gray-50/30">
                {messages.map((msg, idx) => {
                    const isMe = msg.sender === currentUserId || msg.sender?._id === currentUserId;
                    // Show partner avatar only when this msg is from them AND it's the first in a group
                    const nextMsg = messages[idx + 1];
                    const nextIsAlsoFromPartner =
                        nextMsg &&
                        nextMsg.sender !== currentUserId &&
                        nextMsg.sender?._id !== currentUserId;
                    const showAvatar = !isMe && !nextIsAlsoFromPartner;

                    return (
                        <div key={msg._id || idx} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {/* Partner avatar on the left for incoming messages */}
                            {!isMe && (
                                <div className="flex-shrink-0 w-8 h-8">
                                    {showAvatar ? (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-pink-600 font-bold overflow-hidden border-2 border-white shadow-sm">
                                            {partner?.user?.profilePicture ? (
                                                <img
                                                    src={partner.user.profilePicture}
                                                    alt={partner.user.fullName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold">
                                                    {partner?.user?.fullName?.[0] || '?'}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        /* placeholder spacer to keep alignment */
                                        <div className="w-8 h-8" />
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col max-w-[70%]">
                                {/* Show partner role above the first bubble of their group */}
                                {!isMe && showAvatar && (
                                    <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1">
                                        {partner?.user?.isInfluencer ? 'Influencer' : (partner?.role === 'brand' || !partner?.user?.isInfluencer) ? 'Brand' : partner?.user?.fullName || 'Unknown'}
                                    </span>
                                )}
                                <div className={`p-3 rounded-2xl ${isMe
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    <span className={`text-[10px] mt-1 block ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {format(new Date(msg.createdAt), 'HH:mm')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-blue-500 transition-all">
                    <button type="button" className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent py-2 outline-none text-sm text-gray-700"
                        value={newMessage}
                        onChange={handleTyping}
                    />
                    <button type="button" className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                        <Smile className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-all shadow-md shadow-blue-200"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};
