"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { handleLogout } from "@/lib/actions/auth-action"; // I should check if this exists
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user } = useAuth();
    const router = useRouter();

    const onLogout = async () => {
        // Implementation of logout action if needed, or just clear cookies
        // For now, let's assume handleLogout exists or we will create it.
        router.push("/login");
    };

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <Link href="/" className="flex ml-2 md:mr-24 font-bold text-xl text-blue-600">
                            REDO
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center ml-3">
                                <span
                                    onClick={() => user.role === 'admin' && router.push('/admin')}
                                    className={`mr-4 text-sm font-medium text-gray-900 dark:text-white ${user.role === 'admin' ? 'cursor-pointer hover:text-indigo-600' : ''}`}
                                >
                                    {user.fullName} ({user.role})
                                </span>
                                <button
                                    onClick={onLogout}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
