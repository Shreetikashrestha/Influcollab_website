"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video, X, Image as ImageIcon, File, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useSocket } from '@/context/SocketContext';
import EmojiPicker from 'emoji-picker-react';
import { VideoCallModal } from './VideoCallModal';
import { IncomingCallNotification } from './IncomingCallNotification';

interface Message {
    _id: string;
    sender: any;
    senderRole: string;
    content: string;
    attachments?: Array<{
        url: string;
        type: string;
        name: string;
        size: number;
    }>;
    createdAt: string;
}

interface ChatAreaProps {
    conversation: any;
    messages: Message[];
    currentUserId: string;
    onSendMessage: (content: string, attachments?: File[]) => void;
}

export const ChatArea = ({ conversation, messages, currentUserId, onSendMessage }: ChatAreaProps) => {
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [showCallModal, setShowCallModal] = useState(false);
    const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
    const [isCallInitiator, setIsCallInitiator] = useState(false);
    const [incomingCall, setIncomingCall] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

        socket.on('incoming_call', (data: any) => {
            if (data.conversationId === conversation?._id) {
                setIncomingCall(data);
            }
        });

        return () => {
            socket.off('typing');
            socket.off('stop_typing');
            socket.off('incoming_call');
        };
    }, [socket, conversation?._id, currentUserId]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() && selectedFiles.length === 0) return;
        
        onSendMessage(newMessage, selectedFiles);
        setNewMessage('');
        setSelectedFiles([]);
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

    const handleEmojiClick = (emojiData: any) => {
        setNewMessage(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const initiateCall = (type: 'audio' | 'video') => {
        setCallType(type);
        setIsCallInitiator(true);
        setShowCallModal(true);
        
        // Emit call initiation to socket
        socket?.emit('incoming_call', {
            conversationId: conversation._id,
            callType: type,
            callerId: currentUserId,
            caller: {
                _id: currentUserId,
                fullName: 'You',
                profilePicture: null
            },
            to: partner?.user?._id
        });
    };

    const acceptCall = () => {
        setCallType(incomingCall.callType);
        setIsCallInitiator(false);
        setShowCallModal(true);
        
        socket?.emit('call_accepted', {
            conversationId: conversation._id,
            to: incomingCall.from
        });
        
        setIncomingCall(null);
    };

    const rejectCall = () => {
        socket?.emit('call_rejected', {
            conversationId: conversation._id,
            to: incomingCall.from
        });
        setIncomingCall(null);
    };

    const partner = conversation?.participants.find((p: any) => p.user._id !== currentUserId);

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
        return <File className="w-4 h-4" />;
    };

    return (
        <>
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
                            <h4 className="font-bold text-gray-900">{partner?.user?.fullName || 'Select a chat'}</h4>
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
                        <button 
                            onClick={() => initiateCall('audio')}
                            className="p-2 hover:bg-green-50 rounded-lg text-gray-400 hover:text-green-600 transition-all"
                            title="Audio Call"
                        >
                            <Phone className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => initiateCall('video')}
                            className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-all"
                            title="Video Call"
                        >
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
                        const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender?._id;
                        const isMe = senderId === currentUserId;
                        
                        const nextMsg = messages[idx + 1];
                        const nextSenderId = nextMsg ? (typeof nextMsg.sender === 'string' ? nextMsg.sender : nextMsg.sender?._id) : null;
                        const nextIsAlsoFromPartner = nextMsg && nextSenderId !== currentUserId;
                        const showAvatar = !isMe && !nextIsAlsoFromPartner;

                        return (
                            <div key={`${msg._id}-${idx}`} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
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
                                            <div className="w-8 h-8" />
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col max-w-[70%]">
                                    {!isMe && showAvatar && (
                                        <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1">
                                            {partner?.user?.fullName || 'Unknown'}
                                        </span>
                                    )}
                                    <div className={`p-3 rounded-2xl ${isMe
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.content && <p className="text-sm leading-relaxed mb-1">{msg.content}</p>}
                                        
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="space-y-2 mt-2">
                                                {msg.attachments.map((att, i) => (
                                                    <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? 'bg-white/10' : 'bg-gray-50'}`}>
                                                        {att.type.startsWith('image/') ? (
                                                            <img src={att.url} alt={att.name} className="max-w-full rounded-lg" />
                                                        ) : (
                                                            <>
                                                                {getFileIcon(att.type)}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-medium truncate">{att.name}</p>
                                                                    <p className="text-[10px] opacity-70">{formatFileSize(att.size)}</p>
                                                                </div>
                                                                <a href={att.url} download className="p-1 hover:bg-white/20 rounded">
                                                                    <Download className="w-4 h-4" />
                                                                </a>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
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

                {selectedFiles.length > 0 && (
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                                    {getFileIcon(file.type)}
                                    <span className="text-xs font-medium max-w-[150px] truncate">{file.name}</span>
                                    <span className="text-[10px] text-gray-400">{formatFileSize(file.size)}</span>
                                    <button onClick={() => removeFile(index)} className="p-1 hover:bg-red-50 rounded text-red-500">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                    <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-blue-500 transition-all">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            multiple
                            accept="image/*,application/pdf,.doc,.docx,.txt"
                        />
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-blue-600 transition-all"
                            title="Attach file"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent py-2 outline-none text-sm text-gray-700"
                            value={newMessage}
                            onChange={handleTyping}
                        />
                        <div className="relative">
                            <button 
                                type="button" 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-yellow-500 transition-all"
                                title="Add emoji"
                            >
                                <Smile className="w-5 h-5" />
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute bottom-12 right-0 z-50">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={!newMessage.trim() && selectedFiles.length === 0}
                            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-all shadow-md shadow-blue-200"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>

            {showCallModal && callType && (
                <VideoCallModal
                    isOpen={showCallModal}
                    onClose={() => {
                        setShowCallModal(false);
                        setCallType(null);
                        setIsCallInitiator(false);
                    }}
                    callType={callType}
                    partner={partner?.user}
                    conversationId={conversation._id}
                    currentUserId={currentUserId}
                    isInitiator={isCallInitiator}
                />
            )}

            {incomingCall && (
                <IncomingCallNotification
                    caller={incomingCall.caller}
                    callType={incomingCall.callType}
                    onAccept={acceptCall}
                    onReject={rejectCall}
                />
            )}
        </>
    );
};
