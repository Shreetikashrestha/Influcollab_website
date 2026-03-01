"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Check,
    X,
    Eye,
    Search,
    Filter,
    ShieldCheck,
    UserCheck,
    Plus,
    Edit,
    Trash2
} from 'lucide-react';
import { getAllUsers, deleteUser } from '@/lib/api/admin';
import { toast } from 'react-toastify';

export default function UserApprovalPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getAllUsers({
                page,
                limit,
                search: searchTerm
            });
            
            console.log('Users API Response:', response);
            
            if (response && (response as any).success) {
                setUsers((response as any).users || []);
                setTotal((response as any).total || 0);
                setError(null);
            } else {
                const errorMsg = (response as any)?.message || "Failed to fetch users";
                setError(errorMsg);
                setUsers([]);
                setTotal(0);
                toast.error(errorMsg);
            }
        } catch (err: any) {
            console.error('Fetch users error:', err);
            const errorMsg = err.message || "Failed to fetch users";
            setError(errorMsg);
            toast.error(errorMsg);
            setUsers([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit]);

    // Separate effect for search with debounce
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            setPage(1); // Reset to first page on search
            fetchUsers();
        }, 500);
        
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
        const user = users.find(u => u._id === id);
        if (!user) return;

        if (action === 'delete') {
            if (!confirm(`Are you sure you want to delete ${user.fullName}?`)) return;
            try {
                const res = await deleteUser(id) as any;
                if (res.success) {
                    toast.success("User deleted successfully");
                    fetchUsers();
                }
            } catch (err: any) {
                toast.error(err.message || "Delete failed");
            }
            return;
        }

        setNotification(`${user.fullName} has been ${action === 'approve' ? 'Approved' : 'Rejected'}.`);
        setTimeout(() => setNotification(null), 3000);
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="p-4 md:p-8 min-h-screen space-y-8">
            {/* Header omitted for brevity in replace, but keeping structure */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">User Management</h2>
                    <p className="text-gray-500 text-sm font-medium mt-1">Review, verify, and manage platform accounts.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/users/create"
                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        <Plus size={18} /> Create User
                    </Link>
                    <div className="flex bg-white p-1.5 rounded-[20px] border border-gray-100 shadow-sm">
                        <button className="px-6 py-2.5 bg-gray-50 text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest">
                            Total Records ({total})
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="text-white" size={14} />
                        </div>
                        <div>
                            <h3 className="text-red-800 font-bold text-sm mb-1">Failed to Load Users</h3>
                            <p className="text-red-700 text-xs">{error}</p>
                            <button
                                onClick={fetchUsers}
                                className="mt-3 text-xs font-bold text-red-600 hover:text-red-700 underline"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Container */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-gray-50/30">
                    <div className="relative w-full md:w-[450px] group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1); // Reset to first page on search
                            }}
                            className="w-full pl-14 pr-8 py-4 bg-white rounded-[24px] border border-gray-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm font-bold text-gray-900 transition-all placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="px-10 py-6">User Identity</th>
                                <th className="px-10 py-6">Account Class</th>
                                <th className="px-10 py-6">Role</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-center">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Records...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center text-gray-400">No users found</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-[22px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-200">
                                                    {user.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900 text-[15px] tracking-tight">{user.fullName}</div>
                                                    <div className="text-gray-400 text-xs font-bold mt-0.5">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.isInfluencer ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {user.isInfluencer ? 'Influencer' : 'Brand'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link href={`/admin/users/${user._id}`} className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-xl hover:shadow-blue-100 rounded-2xl transition-all border border-transparent hover:border-blue-50" title="Inspect">
                                                    <Eye size={20} />
                                                </Link>
                                                <Link href={`/admin/users/${user._id}/edit`} className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-white hover:text-amber-600 hover:shadow-xl hover:shadow-amber-100 rounded-2xl transition-all border border-transparent hover:border-amber-50" title="Edit">
                                                    <Edit size={20} />
                                                </Link>
                                                <button
                                                    onClick={() => handleAction(user._id, 'delete')}
                                                    className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-white hover:text-red-600 hover:shadow-xl hover:shadow-red-100 rounded-2xl transition-all border border-transparent hover:border-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Page {page} of {totalPages || 1}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(page - 1)}
                            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-600 disabled:opacity-50 transition-all shadow-sm"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage(page + 1)}
                            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-600 disabled:opacity-50 transition-all shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
