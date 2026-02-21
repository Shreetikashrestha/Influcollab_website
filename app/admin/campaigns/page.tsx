"use client";

import React, { useState, useEffect } from 'react';
import { Megaphone, Filter, Plus, Search, Eye, Trash2, Calendar, DollarSign, MapPin, X } from 'lucide-react';
import { adminFetchAllCampaigns } from '@/lib/api/application';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response: any = await adminFetchAllCampaigns({
                page,
                limit,
                search: searchTerm
            });
            
            console.log('Campaigns API Response:', response); // Debug log
            
            if (response && response.success) {
                setCampaigns(response.campaigns || []);
                setTotal(response.total || 0);
                setError(null);
            } else {
                const errorMsg = response?.message || "Failed to fetch campaigns";
                setError(errorMsg);
                setCampaigns([]);
                setTotal(0);
                toast.error(errorMsg);
            }
        } catch (err: any) {
            console.error('Fetch campaigns error:', err);
            const errorMsg = err.message || "Failed to fetch campaigns";
            setError(errorMsg);
            toast.error(errorMsg);
            setCampaigns([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchCampaigns();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [page, limit, searchTerm]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this campaign? This action is irreversible.")) return;
        // Logic for deletion (API endpoint needs to be verified/added)
        toast.info("Campaign deletion is restricted to API integration.");
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="p-4 md:p-8 min-h-screen space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Campaign Monitoring</h1>
                    <p className="text-gray-500 font-medium mt-1">Audit and manage platform-wide collaborations.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/campaigns/create"
                        className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        <Plus size={18} /> New Campaign
                    </Link>
                </div>
            </header>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="text-white" size={14} />
                        </div>
                        <div>
                            <h3 className="text-red-800 font-bold text-sm mb-1">Failed to Load Campaigns</h3>
                            <p className="text-red-700 text-xs">{error}</p>
                            <button
                                onClick={fetchCampaigns}
                                className="mt-3 text-xs font-bold text-red-600 hover:text-red-700 underline"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-gray-50/30">
                    <div className="relative w-full md:w-[450px] group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, brand, or category..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-14 pr-8 py-4 bg-white rounded-[24px] border border-gray-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm font-bold text-gray-900 transition-all placeholder:text-gray-300"
                        />
                    </div>
                    <div className="flex bg-white p-1.5 rounded-[20px] border border-gray-100 shadow-sm">
                        <button className="px-6 py-2.5 bg-gray-50 text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest">
                            {total} Active Campaigns
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="px-10 py-6">Campaign Info</th>
                                <th className="px-10 py-6">Brand / Creator</th>
                                <th className="px-10 py-6">Category</th>
                                <th className="px-10 py-6">Budget</th>
                                <th className="px-10 py-6">Applicants</th>
                                <th className="px-10 py-6 text-center">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Data...</td>
                                </tr>
                            ) : campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-20 h-20 rounded-[28px] bg-purple-50 flex items-center justify-center text-purple-400">
                                                <Megaphone size={40} />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 tracking-tight">No Campaigns Found</h3>
                                            <p className="text-gray-400 font-medium max-w-sm mx-auto">Either there are no campaigns in the system or your search didn't match any.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                campaigns.map((campaign) => (
                                    <tr key={campaign._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-7">
                                            <div className="space-y-1">
                                                <div className="font-black text-gray-900 text-[15px] tracking-tight truncate max-w-[250px]">{campaign.title}</div>
                                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                                                    <Calendar size={12} className="text-blue-500" />
                                                    Due: {format(new Date(campaign.deadline), 'MMM dd, yyyy')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                                                    {campaign.brandName?.charAt(0) || campaign.creatorId?.fullName?.charAt(0)}
                                                </div>
                                                <div className="font-bold text-gray-700 text-sm">
                                                    {campaign.brandName || campaign.creatorId?.fullName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                {campaign.category}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-1.5 font-black text-emerald-600 text-sm tracking-tight text-center">
                                                <DollarSign size={14} />
                                                {campaign.budgetMin?.toLocaleString()} - {campaign.budgetMax?.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-black shadow-sm shadow-blue-100/50">
                                                {campaign.applicantsCount || 0}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link href={`/campaigns/${campaign._id}`} className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-xl hover:shadow-blue-100 rounded-2xl transition-all border border-transparent hover:border-blue-50" title="View Details">
                                                    <Eye size={20} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(campaign._id)}
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

                <div className="p-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Page {page} of {totalPages || 1}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(page - 1)}
                            className="px-8 py-3.5 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-600 disabled:opacity-50 transition-all shadow-sm group border-transparent hover:border-gray-200"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage(page + 1)}
                            className="px-8 py-3.5 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-600 disabled:opacity-50 transition-all shadow-sm border-transparent hover:border-gray-200"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
