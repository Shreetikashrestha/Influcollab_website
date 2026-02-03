"use client";

import { Search, Bell, Send, Paperclip, Smile, MoreVertical, CheckCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function InfluencerMessagesPage() {
    const { user } = useAuth();

    const conversations = [
        { name: "Vajra Style Nepal", message: "We loved your portfolio! Let's discuss...", time: "10:30 AM", unread: 5, active: true },
        { name: "Sherpa Outdoor", message: "The product samples will be shipped tomorrow", time: "Yesterday", unread: 0 },
        { name: "Pure Himalayan Foods", message: "Looking forward to our collaboration!", time: "Monday", unread: 0 },
        { name: "Nepal Tech Hub", message: "Can you join us for the launch event on Dec 15?", time: "23 Nov", unread: 0 },
    ];

    const messages = [
        { sender: "brand", text: "Hi! We came across your profile and are impressed with your content.", time: "10:30 AM" },
        { sender: "brand", text: "We have an exciting campaign for our summer collection.", time: "10:31 AM" },
        { sender: "user", text: "Thank you! I'd love to hear more about it.", time: "10:35 AM" },
        { sender: "brand", text: "Great! The campaign involves promoting our traditional wear collection.", time: "10:38 AM" },
        { sender: "user", text: "That sounds perfect for my audience. What are the requirements?", time: "10:40 AM" },
        { sender: "brand", text: "We loved your portfolio! Let's discuss the campaign details.", time: "10:42 AM" },
    ];

    return (
        <div className="bg-[#fcfcfd] h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-6 bg-[#fcfcfd] shrink-0">
                <h1 className="text-[32px] font-black text-slate-900 tracking-tight">Messages</h1>
                <div className="flex items-center gap-4">
                    <button className="relative p-3.5 bg-white shadow-sm rounded-2xl text-slate-400 hover:text-purple-600 hover:shadow-md transition-all border border-slate-50">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 bg-white p-2 pr-4 shadow-sm rounded-full hover:shadow-md transition-all cursor-pointer border border-slate-50">
                        <div className="w-9 h-9 rounded-full bg-auth-gradient p-[1px]">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-white">
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{user?.fullName?.split(' ')[0] || 'User'}</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden border-t border-slate-100 mx-8 mb-8 bg-white rounded-[40px] shadow-sm">
                {/* Conversations Sidebar */}
                <div className="w-96 border-r border-slate-50 flex flex-col">
                    <div className="p-8 pb-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-4 py-4 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-purple-100 placeholder:text-slate-300 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2">
                        {conversations.map((conv, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-4 p-4 rounded-[24px] cursor-pointer transition-all ${conv.active ? "bg-purple-50/50" : "hover:bg-slate-50"
                                    }`}
                            >
                                <div className="w-14 h-14 rounded-full bg-slate-100 p-0.5 shrink-0 relative">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${conv.name.split(' ')[0]}&background=random`}
                                            alt={conv.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-sm font-black text-slate-800 truncate">{conv.name}</h3>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase shrink-0">{conv.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <p className="text-xs font-bold text-slate-400 truncate">{conv.message}</p>
                                        {conv.unread > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 min-w-[18px] text-center">
                                                {conv.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full p-0.5 bg-slate-100 relative">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    <img src="https://ui-avatars.com/api/?name=Vajra&background=random" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h4 className="text-[15px] font-black text-slate-800">Vajra Style Nepal</h4>
                                <span className="text-[11px] font-bold text-slate-400">Active now</span>
                            </div>
                        </div>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-all">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] p-5 rounded-[24px] ${msg.sender === "user"
                                            ? "bg-auth-gradient text-white rounded-tr-none shadow-lg shadow-purple-100"
                                            : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
                                        }`}
                                >
                                    <p className="text-sm font-semibold leading-relaxed">{msg.text}</p>
                                    <div className={`flex items-center gap-1 mt-2 ${msg.sender === "user" ? "text-white/70" : "text-slate-300"} text-[10px] font-bold`}>
                                        <span>{msg.time}</span>
                                        {msg.sender === "user" && <CheckCheck className="w-3.5 h-3.5" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-8 pt-0">
                        <div className="bg-slate-50 rounded-[28px] p-2 flex items-center gap-2 border border-slate-100 shadow-sm focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                            <button className="p-3 text-slate-400 hover:text-purple-600 transition-all">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <button className="p-3 text-slate-400 hover:text-purple-600 transition-all">
                                <Smile className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-300"
                            />
                            <button className="p-3.5 bg-auth-gradient text-white rounded-2xl shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-all">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
