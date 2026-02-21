"use client";

import React, { useState, useEffect } from 'react';
import { fetchBrandCampaigns } from '@/lib/api/campaign';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Link from 'next/link';
import {
    Plus,
    Search,
    ExternalLink,
    Users,
    Calendar,
    Settings,
    LayoutGrid,
    Target
} from 'lucide-react';

export default function BrandCampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            const res: any = await fetchBrandCampaigns();
            if (res.success) {
                setCampaigns(res.campaigns);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to load campaigns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 min-h-screen space-y-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Campaigns</h1>
                    <p className="text-gray-500 font-medium mt-2">Scale your presence with top-tier talent.</p>
                </div>
                <Link
                    href="/campaigns/create"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-gray-200"
                >
                    <Plus size={20} /> Launch Campaign
                </Link>
            </header>

            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={22} />
                <input
                    type="text"
                    placeholder="Search your active projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white rounded-[32px] border border-gray-100 shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-base font-bold text-gray-900 transition-all placeholder:text-gray-300"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[400px] bg-white rounded-[48px] border border-gray-100 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredCampaigns.length === 0 ? (
                <div className="bg-white rounded-[48px] border border-gray-100 p-20 text-center max-w-4xl mx-auto shadow-sm">
                    <div className="w-24 h-24 rounded-[32px] bg-blue-50 flex items-center justify-center text-blue-500 mx-auto mb-10">
                        <Target size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">No Campaigns Active</h2>
                    <p className="text-gray-400 font-medium max-w-md mx-auto mb-10 text-lg">You haven't launched any collaborations yet. Start by creating a brief to attract top influencers.</p>
                    <Link href="/campaigns/create" className="text-blue-600 font-black uppercase tracking-widest text-sm hover:underline">Launch your first brief →</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredCampaigns.map((campaign) => (
                        <div key={campaign._id} className="bg-white rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/40 transition-all group overflow-hidden flex flex-col h-full">
                            <div className="p-10 space-y-8 flex-grow">
                                <div className="flex items-start justify-between">
                                    <div className="px-5 py-2 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                        {campaign.category}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{campaign.title}</h3>
                                    <div className="flex items-center gap-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                        <Calendar size={14} className="text-blue-500" />
                                        Ends {format(new Date(campaign.deadline), 'MMM dd, yyyy')}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100/30">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Applicants</p>
                                        <p className="text-2xl font-black text-blue-700">{campaign.applicantsCount || 0}</p>
                                    </div>
                                    <div className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100/30">
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-sm font-black text-emerald-700 uppercase">{campaign.status}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 bg-gray-50 group-hover:bg-blue-600 transition-all flex flex-col gap-4">
                                <Link
                                    href={`/campaigns/${campaign._id}`}
                                    className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-all mb-2"
                                    aria-label="View Details"
                                >
                                    View Details
                                </Link>
                                <Link
                                    href={`/campaigns/${campaign._id}/edit`}
                                    className="block w-full text-center bg-gray-200 text-blue-700 font-bold py-3 rounded-xl shadow hover:bg-gray-300 transition-all"
                                    aria-label="Edit Campaign"
                                >
                                    Edit
                                </Link>
                                <Link
                                    href={`/brand/campaigns/${campaign._id}/applications`}
                                    className="flex items-center justify-between w-full text-blue-600 hover:text-blue-800 mt-2"
                                >
                                    <span className="font-black uppercase tracking-[0.2em] text-xs">Manage Submissions</span>
                                    <ExternalLink size={18} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
