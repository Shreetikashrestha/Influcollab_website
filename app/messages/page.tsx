import { handleFetchMessages } from "@/lib/actions/message-action";
import Link from "next/link";
import { UserCircle, MessageSquare } from "lucide-react";

export default async function MessagesPage() {
    const response = (await handleFetchMessages()) as any;

    if (!response.success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600">{response.message}</p>
            </div>
        );
    }

    const chats = response.data || [];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
                Messages
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                {chats.length === 0 ? (
                    <div className="p-12 text-center">
                        <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No messages yet.</p>
                        <p className="text-gray-400">Start a conversation from a campaign details page!</p>
                    </div>
                ) : (
                    chats.map((chat: any) => (
                        <Link
                            key={chat.partnerId}
                            href={`/messages/${chat.partnerId}`}
                            className="flex items-center p-6 hover:bg-gray-50 transition-all group"
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-100 transition-colors">
                                <UserCircle className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{chat.partnerName}</h3>
                                <p className="text-gray-500 line-clamp-1">{chat.lastMessage}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-medium">
                                    {new Date(chat.lastTimestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
