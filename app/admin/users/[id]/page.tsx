"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Mail,
    User,
    Shield,
    Calendar,
    Edit,
    Trash2,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { getUserById, updateUser } from '@/lib/api/admin';
import { toast } from 'react-toastify';

interface User {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    isInfluencer: boolean;
    createdAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    users?: T;
    total?: number;
}

export default function UserDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Assert the response type for getUserById
                const res: ApiResponse<User> = await getUserById(id as string);
                if (res.success && res.data) {
                    setUser(res.data);
                } else {
                    toast.error(res.message || "Failed to fetch user");
                }
            } catch (err: any) {
                toast.error(err.message || "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleDelete = async () => {
        if (!user) return; // Ensure user is loaded before confirming
        if (!confirm(`Are you sure you want to delete ${user.fullName}?`)) return;
        try {
            // Assert the response type for deleteUser
            const res: ApiResponse<null> = await deleteUser(id as string);
            if (res.success) {
                toast.success("User deleted successfully");
                router.push('/admin/users');
            } else {
                toast.error(res.message || "Delete failed");
            }
        } catch (err: any) {
            toast.error(err.message || "Delete failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 font-bold">User not found</p>
                <Link href="/admin/users" className="text-blue-600 font-black uppercase tracking-widest text-xs">Back to List</Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link
                href="/admin/users"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm mb-10 transition-colors"
            >
                <ArrowLeft size={16} />
                Back to User Management
            </Link>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-white">
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 rounded-[32px] bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-black">
                            {user.fullName.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight mb-2">{user.fullName}</h1>
                            <div className="flex items-center gap-4">
                                <span className="bg-white/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                    {user.isInfluencer ? 'Influencer' : 'Brand'}
                                </span>
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${user.role === 'admin' ? 'bg-red-500/20' : 'bg-white/10'}`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-12 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest">Account Information</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="font-bold text-gray-900">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Joined On</p>
                                    <p className="font-bold text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest">Platform Status</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                                    <p className="font-black text-emerald-600 uppercase tracking-widest text-xs">Active Account</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-gray-50 flex items-center gap-4">
                        <Link
                            href={`/admin/users/${id}/edit`}
                            className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-all"
                        >
                            <Edit size={16} /> Edit Profile
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-8 bg-red-50 text-red-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-all border border-red-100"
                        >
                            <Trash2 size={16} /> Delete User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
