"use client";

import React, { useState, useEffect } from 'react';
import { adminFetchAllApplications, updateApplicationStatus } from '@/lib/api/application';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
    CheckCircle,
    XCircle,
    Clock,
    User,
    FileText,
    Filter,
    ChevronLeft,
    ChevronRight,
    Activity
} from 'lucide-react';

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response: any = await adminFetchAllApplications({ page, limit });
            if (response.success) {
                setApplications(response.data || response.applications || []);
                setTotal(response.total || response.count || 0);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [page, limit]);

    const handleUpdateStatus = async (id: string, status: 'accepted' | 'rejected') => {
        try {
            await updateApplicationStatus(id, status);
            toast.success(`Application ${status} successfully`);
            fetchApplications();
        } catch (err: any) {
            toast.error(err.message || "Failed to update status");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted': return <CheckCircle size={16} className="text-emerald-500" />;
            case 'rejected': return <XCircle size={16} className="text-red-500" />;
            default: return <Clock size={16} className="text-amber-500" />;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="p-4 md:p-8 min-h-screen space-y-10">
            <header>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Collaboration Feed</h1>
                <p className="text-gray-500 font-medium mt-1">Audit and manage influencer-brand applications.</p>
            </header>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <div className="flex bg-white p-1.5 rounded-[20px] border border-gray-100 shadow-sm">
                        <button className="px-6 py-2.5 bg-gray-50 text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest">
                            {total} Total Submissions
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="px-10 py-6">Influencer</th>
                                <th className="px-10 py-6">Campaign</th>
                                <th className="px-10 py-6">Date Submitted</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-center">Audit Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Database...</td>
                                </tr>
                            ) : applications?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-20 h-20 rounded-[28px] bg-indigo-50 flex items-center justify-center text-indigo-400 text-center mx-auto">
                                                <Activity size={40} />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Quiet on the Platform</h3>
                                            <p className="text-gray-400 font-medium max-w-sm mx-auto">No influencer applications have been submitted yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black text-xs border border-purple-100/50">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900 text-[14px] tracking-tight">{app.influencerId?.fullName || "Awaiting Data"}</div>
                                                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-wider">{app.influencerId?.email || "N/A"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                                                    <FileText size={14} />
                                                </div>
                                                <div className="font-bold text-gray-700 text-sm truncate max-w-[200px]">
                                                    {app.campaignId?.title || "Campaign Deleted"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                {format(new Date(app.createdAt), 'MMM dd, HH:mm')}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${getStatusStyles(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {app.status}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center justify-center gap-2">
                                                {app.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                                            className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Action Locked</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Page {page} of {totalPages || 1}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(page - 1)}
                            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 disabled:opacity-50 transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage(page + 1)}
                            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 disabled:opacity-50 transition-all shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
