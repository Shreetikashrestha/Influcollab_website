"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Megaphone,
    CircleDollarSign,
    Settings
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
        { label: "Users", icon: Users, href: "/admin/users" },
        { label: "Campaigns", icon: Megaphone, href: "/admin/campaigns" },
        { label: "Payments", icon: CircleDollarSign, href: "/admin/payments" },
        { label: "Settings", icon: Settings, href: "/admin/settings" },
    ];

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111827] text-gray-400 p-6 hidden lg:block fixed h-full z-50">
                <div className="flex items-center gap-3 text-white mb-10 px-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <LayoutDashboard size={20} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">CollabHub</span>
                </div>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                        : "hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64">
                {children}
            </div>
        </div>
    );
}
