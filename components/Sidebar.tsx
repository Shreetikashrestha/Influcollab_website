"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    MessageSquare,
    UserCircle,
    Search,
    Bell,
    Settings,
    LogOut,
    Heart,
    Home,
    Plus,
    BarChart3,
    Users,
    CreditCard,
    Wallet
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const isBrand = user?.isInfluencer === false;
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    useEffect(() => {
        const fetchUnreadCounts = async () => {
            try {
                // Fetch unread messages count
                const messagesRes = await fetch('/api/messages/conversations', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (messagesRes.ok) {
                    const messagesData = await messagesRes.json();
                    if (messagesData.success && messagesData.conversations) {
                        const totalUnread = messagesData.conversations.reduce((sum: number, conv: any) => {
                            return sum + (conv.unreadCount?.[user?._id] || 0);
                        }, 0);
                        setUnreadMessages(totalUnread);
                    }
                }

                // Fetch unread notifications count
                const notifRes = await fetch('/api/notifications/unread-count', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (notifRes.ok) {
                    const notifData = await notifRes.json();
                    if (notifData.success) {
                        setUnreadNotifications(notifData.count || 0);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch unread counts:', error);
            }
        };

        if (user?._id) {
            fetchUnreadCounts();
            // Refresh every 30 seconds
            const interval = setInterval(fetchUnreadCounts, 30000);
            return () => clearInterval(interval);
        }
    }, [user?._id]);


    const influencerLinks = [
        { name: "Home", href: "/influencer", icon: Home },
        { name: "Discover", href: "/campaigns", icon: Search },
        { name: "Messages", href: "/messages", icon: MessageSquare, badge: unreadMessages },
        { name: "Profile", href: "/user/profile", icon: UserCircle },
    ];

    const brandLinks = [
        { name: "Dashboard", href: "/brand", icon: LayoutDashboard },
        { name: "Find Influencers", href: "/influencers", icon: Search },
        { name: "Messages", href: "/messages", icon: MessageSquare, badge: unreadMessages },
        { name: "Brand Profile", href: "/user/profile", icon: UserCircle },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
    ];

    const menuLinks = isBrand ? brandLinks : influencerLinks;

    const bottomLinks = [
        { name: "Notifications", href: "/notifications", icon: Bell, badge: unreadNotifications },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <aside
            id="logo-sidebar"
            className="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full bg-white border-r border-gray-100 sm:translate-x-0 flex flex-col"
            aria-label="Sidebar"
        >
            {/* Branding */}
            <div className="px-6 py-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-auth-gradient rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                    <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <span className="text-2xl font-black text-slate-800 tracking-tight">Collab</span>
            </div>

            {/* Create Campaign Button (Brand Only) */}
            {isBrand && (
                <div className="px-4 mb-6">
                    <Link
                        href="/campaigns/create"
                        className="flex items-center justify-center gap-2 w-full bg-auth-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-100 transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Campaign</span>
                    </Link>
                </div>
            )}

            <div className="flex-1 px-4 overflow-y-auto">
                <ul className="space-y-2 font-medium">
                    {menuLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center justify-between p-3.5 rounded-2xl group transition-all duration-300 ${isActive
                                        ? "bg-auth-gradient text-white shadow-lg shadow-purple-200"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
                                        <span className="ml-4 text-[15px] font-semibold">{link.name}</span>
                                    </div>
                                    {link.badge && link.badge > 0 && !isActive && (
                                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                                            {link.badge > 99 ? '99+' : link.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="my-8 border-t border-slate-100"></div>

                <ul className="space-y-2 font-medium">
                    {bottomLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center justify-between p-3.5 rounded-2xl group transition-all duration-300 ${isActive
                                        ? "bg-auth-gradient text-white shadow-lg shadow-purple-200"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
                                        <span className="ml-4 text-[15px] font-semibold">{link.name}</span>
                                    </div>
                                    {link.badge && link.badge > 0 && !isActive && (
                                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                                            {link.badge > 99 ? '99+' : link.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-auth-gradient p-[2px]">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=random`}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 truncate max-w-[120px]">
                                {user?.fullName || "User Name"}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                                @{user?.username || "username"}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
