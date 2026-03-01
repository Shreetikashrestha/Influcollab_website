"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, UserCircle, CheckCheck, Clock, Plus, X, UserPlus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { searchUsersForMessaging } from '@/lib/api/user';
import { debounce } from 'lodash';

interface Conversation {
    _id: string;
    participants: any[];
    lastMessage?: {
        content: string;
        createdAt: string;
        sender: string;
    };
    unreadCount: Record<string, number>;
    campaignId?: string;
}

interface User {
    _id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
    isInfluencer: boolean;
    role: string;
}

interface ConversationsListProps {
    conversations: Conversation[];
    currentUserId: string;
    onSelect: (id: string) => void;
    onStartNewChat: (user: User) => void;
    activeId?: string;
}

export const ConversationsList = ({ conversations, currentUserId, onSelect, onStartNewChat, activeId }: ConversationsListProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [newChatSearch, setNewChatSearch] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearchingUsers, setIsSearchingUsers] = useState(false);

    const filteredConversations = conversations.filter(conv => {
        const partner = conv.participants.find(p => p.user._id !== currentUserId);
        return partner?.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleUserSearch = async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearchingUsers(true);
        try {
            const response = await searchUsersForMessaging(query) as any;
            if (response.success) {
                setSearchResults(response.data);
            }
        } catch (error) {
            setSearchResults([]);
        } finally {
            setIsSearchingUsers(false);
        }
    };

    const debouncedSearch = useRef(
        debounce((query: string) => handleUserSearch(query), 500)
    ).current;

    useEffect(() => {
        if (isSearching) {
            debouncedSearch(newChatSearch);
        }
        return () => debouncedSearch.cancel();
    }, [newChatSearch, isSearching, debouncedSearch]);

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">Messages</h1>
                <button
                    onClick={() => setIsSearching(!isSearching)}
                    className={`p-2 rounded-xl transition-all ${isSearching ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                >
                    {isSearching ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
            </div>

            {/* Profile circles - Instagram style */}
            {!isSearching && conversations.length > 0 && (
                <div className="p-4 bg-gray-50/30 overflow-x-auto no-scrollbar border-b border-gray-100">
                    <div className="flex gap-4 min-w-max">
                        {conversations.slice(0, 10).map((conv) => {
                            const partner = conv.participants.find(p => p.user._id !== currentUserId);
                            const isActive = activeId === conv._id;
                            const unread = conv.unreadCount[currentUserId] || 0;

                            return (
                                <button
                                    key={`circle-${conv._id}`}
                                    onClick={() => onSelect(conv._id)}
                                    className="flex flex-col items-center gap-1 group"
                                >
                                    <div className={`relative p-0.5 rounded-full border-2 transition-all ${isActive ? 'border-blue-500 scale-110' : unread > 0 ? 'border-pink-500' : 'border-transparent'}`}>
                                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-95">
                                            {partner?.user?.profilePicture ? (
                                                <img src={partner.user.profilePicture} alt={partner.user.fullName} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-lg font-bold text-blue-600">{partner?.user?.fullName[0] || '?'}</span>
                                            )}
                                        </div>
                                        {unread > 0 && (
                                            <div className="absolute top-0 right-0 w-4 h-4 bg-pink-500 rounded-full border-2 border-white shadow-sm" />
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold truncate max-w-[60px] ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {partner?.user?.fullName.split(' ')[0]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="p-4 border-b border-gray-100">
                {isSearching ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Find someone to message..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-blue-100 rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm ring-2 ring-transparent focus:ring-blue-50"
                                value={newChatSearch}
                                onChange={(e) => setNewChatSearch(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {/* User search results */}
                        <div className="max-h-[300px] overflow-y-auto rounded-xl border border-gray-50">
                            {isSearchingUsers ? (
                                <div className="p-4 flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <button
                                        key={user._id}
                                        onClick={() => {
                                            onStartNewChat(user);
                                            setIsSearching(false);
                                            setNewChatSearch('');
                                            setSearchResults([]);
                                        }}
                                        className="w-full flex items-center p-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border-2 border-white shadow-sm">
                                            {user.profilePicture ? (
                                                <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                                            ) : (
                                                user.fullName[0]
                                            )}
                                        </div>
                                        <div className="ml-3 text-left">
                                            <p className="text-sm font-bold text-gray-800">{user.fullName}</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                                                {user.isInfluencer ? 'Influencer' : user.role}
                                            </p>
                                        </div>
                                        <UserPlus className="ml-auto w-4 h-4 text-blue-400" />
                                    </button>
                                ))
                            ) : newChatSearch.length >= 2 ? (
                                <div className="p-4 text-center">
                                    <p className="text-xs text-gray-400">No users found</p>
                                </div>
                            ) : (
                                <div className="p-4 text-center">
                                    <p className="text-xs text-gray-400 font-medium italic">Type at least 2 characters to search</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search existing chats..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 && !isSearching ? (
                    <div className="p-8 text-center">
                        <UserCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm font-medium">Your inbox is empty</p>
                        <button
                            onClick={() => setIsSearching(true)}
                            className="mt-3 text-sm font-bold text-blue-600 hover:underline"
                        >
                            Start a new chat
                        </button>
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const partner = conv.participants.find(p => p.user._id !== currentUserId);
                        const isActive = activeId === conv._id;
                        const unread = conv.unreadCount[currentUserId] || 0;

                        return (
                            <button
                                key={conv._id}
                                onClick={() => onSelect(conv._id)}
                                className={`w-full flex items-start p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${isActive ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                                        {partner?.user?.profilePicture ? (
                                            <img src={partner.user.profilePicture} alt={partner.user.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            partner?.user?.fullName[0] || '?'
                                        )}
                                    </div>
                                    {unread > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                                            {unread}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-3 flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-gray-900 truncate pr-2">
                                            {partner?.user?.fullName || 'Unknown User'}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap bg-gray-50 px-1.5 py-0.5 rounded-md">
                                            {conv.lastMessage ? format(new Date(conv.lastMessage.createdAt), 'HH:mm') : ''}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate ${unread > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                                        {conv.lastMessage ? conv.lastMessage.content : 'No messages yet'}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};
