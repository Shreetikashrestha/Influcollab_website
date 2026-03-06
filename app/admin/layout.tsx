"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    Users,
    Megaphone,
    LogOut,
    Heart
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCampaigns: 0
    });

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (user.role !== "admin") {
                // Redirect non-admin users to their respective dashboards
                if (user.isInfluencer === false || user.role === "brand") {
                    router.push("/brand");
                } else {
                    router.push("/influencer");
                }
            }
        }
    }, [user, loading, router]);

    // Fetch real-time stats for badges
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { getAllUsers } = await import('@/lib/api/admin');
                const { adminFetchAllCampaigns } = await import('@/lib/api/application');
                
                try {
                    const usersRes: any = await getAllUsers({ limit: 1 });
                    if (usersRes.success) {
                        setStats(prev => ({ ...prev, totalUsers: usersRes.total || 0 }));
                    }
                } catch (error) {
                    console.error('Failed to fetch users:', error);
                }

                try {
                    const campaignsRes: any = await adminFetchAllCampaigns({ limit: 1 });
                    if (campaignsRes.success) {
                        setStats(prev => ({ ...prev, totalCampaigns: campaignsRes.total || 0 }));
                    }
                } catch (error) {
                    console.error('Failed to fetch campaigns:', error);
                }
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            }
        };

        if (user?.role === 'admin') {
            fetchStats();
            // Refresh stats every 30 seconds
            const interval = setInterval(fetchStats, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Don't render admin content if user is not admin
    if (!user || user.role !== "admin") {
        return null;
    }

    const menuItems = [
        { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard", badge: null },
        { label: "Users", icon: Users, href: "/admin/users", badge: stats.totalUsers > 0 ? stats.totalUsers : null },
        { label: "Campaigns", icon: Megaphone, href: "/admin/campaigns", badge: stats.totalCampaigns > 0 ? stats.totalCampaigns : null },
    ];

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111827] text-gray-400 p-6 hidden lg:block fixed h-full z-50">
                {/* Branding */}
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Heart className="w-6 h-6 text-white fill-white" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tight">InfluCollab</span>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 flex-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                        : "hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                {item.badge && !isActive && (
                                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                {user?.fullName?.charAt(0) || 'A'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white truncate max-w-[100px]">
                                    {user?.fullName || "Admin"}
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium">
                                    Administrator
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64">
                {children}
            </div>
        </div>
    );
}
