"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    User,
    Mail,
    Shield,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { getUserById, updateUser } from '@/lib/api/admin';
import { toast } from 'react-toastify';

export default function EditUserPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'user',
        isInfluencer: false
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserById(id as string);
                if (res.success) {
                    setFormData({
                        fullName: res.data.fullName,
                        email: res.data.email,
                        role: res.data.role,
                        isInfluencer: res.data.isInfluencer
                    });
                }
            } catch (err: any) {
                toast.error("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Convert to FormData as expected by API
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('email', formData.email);
            data.append('role', formData.role);
            data.append('isInfluencer', formData.isInfluencer.toString());

            const res = await updateUser(id as string, data);
            if (res.success) {
                toast.success("User updated successfully");
                router.push(`/admin/users/${id}`);
            }
        } catch (err: any) {
            toast.error(err.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Link
                href={`/admin/users/${id}`}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm mb-10 transition-colors"
            >
                <ArrowLeft size={16} />
                Back to Profille
            </Link>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-gray-50 bg-gray-50/30">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Edit User Account</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1">Modify account details and access level.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Account Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Account Type</label>
                                <select
                                    value={formData.isInfluencer ? 'influencer' : 'brand'}
                                    onChange={(e) => setFormData({ ...formData, isInfluencer: e.target.value === 'influencer' })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                                >
                                    <option value="brand">Brand</option>
                                    <option value="influencer">Influencer</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-[24px] font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
