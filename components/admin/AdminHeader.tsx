"use client";

import { Bell, ShieldCheck, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminHeader() {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-auth-gradient rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                    <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">Collab Admin</h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Platform Management</p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span>Go to Site</span>
                </Link>

                <button className="relative p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-purple-600 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
                    <div className="text-right">
                        <p className="text-sm font-black text-slate-800 leading-none mb-1">{user?.fullName || "Admin User"}</p>
                        <p className="text-[11px] font-bold text-slate-400">{user?.email || "admin@collab.com"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-auth-gradient p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                            <img
                                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName || 'Admin'}&background=random`}
                                alt="Admin"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
