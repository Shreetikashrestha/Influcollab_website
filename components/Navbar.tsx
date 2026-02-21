"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { NotificationDropdown } from "./NotificationDropdown";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const onLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-4 md:px-8 sticky top-0 z-40 transition-all">
            <div className="flex-1 flex items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                            Collab
                        </span>
                    </Link>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    {user ? (
                        <>
                            <NotificationDropdown />

                            <div className="h-8 w-px bg-gray-100 mx-2"></div>

                            <div className="flex items-center space-x-3">
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-bold text-gray-900 leading-tight">{user.fullName}</p>
                                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{user.role}</p>
                                </div>
                                <div className="group relative">
                                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 transition-all hover:shadow-md">
                                        <UserIcon className="w-5 h-5" />
                                    </button>

                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all transform origin-top-right scale-95 group-hover:scale-100">
                                        <Link href="/user/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <UserIcon className="w-4 h-4 mr-2" /> Profile
                                        </Link>
                                        <button
                                            onClick={onLogout}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
