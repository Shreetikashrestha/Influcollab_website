"use client";

import { Bell, CheckCircle, Clock } from "lucide-react";

export default function NotificationsPage() {
    const notifications = [
        {
            id: 1,
            title: "New Campaign Opportunity",
            message: "Nike is looking for fashion influencers for their upcoming summer collection.",
            time: "2 hours ago",
            type: "campaign",
            read: false
        },
        {
            id: 2,
            title: "Application Accepted",
            message: "Your application for the 'Tech Review 2024' campaign has been accepted.",
            time: "5 hours ago",
            type: "success",
            read: true
        },
        {
            id: 3,
            title: "New Message",
            message: "Adidas sent you a message regarding your collaboration.",
            time: "Yesterday",
            type: "message",
            read: true
        }
    ];

    return (
        <div className="bg-[#fcfcfd] min-h-screen px-8 py-10">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-[32px] font-black text-slate-900 tracking-tight">Notifications</h1>
                    <button className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
                        Mark all as read
                    </button>
                </div>

                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-6 rounded-[32px] border transition-all duration-300 ${notification.read
                                    ? "bg-white border-slate-100 shadow-sm"
                                    : "bg-white border-purple-100 shadow-md shadow-purple-50/50"
                                }`}
                        >
                            <div className="flex gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${notification.type === 'campaign' ? "bg-blue-50 text-blue-500" :
                                        notification.type === 'success' ? "bg-green-50 text-green-500" :
                                            "bg-purple-50 text-purple-500"
                                    }`}>
                                    {notification.type === 'campaign' ? <Bell className="w-6 h-6" /> :
                                        notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> :
                                            <Bell className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                            {notification.title}
                                        </h3>
                                        {!notification.read && (
                                            <span className="w-2.5 h-2.5 bg-purple-600 rounded-full"></span>
                                        )}
                                    </div>
                                    <p className="text-[15px] font-medium text-slate-500 mb-3 leading-relaxed">
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{notification.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {notifications.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="w-8 h-8 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No notifications yet</h3>
                        <p className="text-slate-400 font-medium">We'll notify you when something important happens.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
