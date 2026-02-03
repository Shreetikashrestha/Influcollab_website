"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Megaphone,
    Banknote,
    BarChart3,
    Settings
} from "lucide-react";

const navLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
    { name: "Transactions", href: "/admin/transactions", icon: Banknote },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="bg-white border-b border-slate-100 px-8">
            <div className="flex gap-8">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-2 px-1 py-5 border-b-2 transition-all font-bold text-sm ${isActive
                                    ? "border-purple-600 text-purple-600"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
