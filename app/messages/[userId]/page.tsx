"use client";

import { useState, useEffect, useRef, use } from "react";
import { handleFetchChat, handleSendMessage } from "@/lib/actions/message-action";
import { UserCircle, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Message {
    _id: string;
    sender: string;
    content: string;
    timestamp: string;
}

export default function ChatWindowPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        async function loadChat() {
            const res = (await handleFetchChat(userId)) as any;
            if (res.success) {
                setMessages(res.data.messages);
            }
            setLoading(false);
            scrollToBottom();
        }
        loadChat();
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const content = newMessage;
        setNewMessage("");

        const res = (await handleSendMessage(userId, content)) as any;
        if (res.success) {
            // Optimistic update or refetch
            const updated = (await handleFetchChat(userId)) as any;
            if (updated.success) {
                setMessages(updated.data.messages);
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col h-[calc(100vh-120px)]">
            <header className="bg-white p-4 rounded-t-2xl shadow-sm border-x border-t border-gray-100 flex items-center">
                <Link href="/messages" className="mr-4 text-gray-500 hover:text-blue-600">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
                    <UserCircle className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="font-bold text-gray-900 leading-tight">Conversation</h2>
                    <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
            </header>

            <div className="flex-1 bg-white border-x border-gray-100 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400">Send a message to start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender !== userId;
                        return (
                            <div
                                key={msg._id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <p className={`text-[10px] mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <footer className="bg-gray-50 p-4 rounded-b-2xl border-x border-b border-gray-100">
                <form onSubmit={onSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all shadow-sm text-sm"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
}
