"use client";

import React, { useState, useEffect } from 'react';
import { fetchMyApplications } from '@/lib/api/application';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
    LayoutGrid,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Target,
    Calendar,
    Briefcase,
    Zap
} from 'lucide-react';
import Link from 'next/link';

export default function InfluencerApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadApplications = async () => {
            try {
                setLoading(true);
                const res: any = await fetchMyApplications();
                if (res.success) {
                    setApplications(Array.isArray(res.data) ? res.data : []);
                }
            } catch (err: any) {
                toast.error(err.message || "Failed to load your submissions");
            } finally {
                setLoading(false);
            }
        };
        loadApplications();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 size={16} />;
            case 'rejected': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div className="p-4 md:p-10 min-h-screen space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 scroll-m-20 border border-purple-100/50">
                        <Zap size={14} className="fill-purple-600" /> Active Tracking
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Applied Campaigns</h1>
                    <p className="text-gray-500 font-medium mt-2">Monitor your collaboration pipeline and status updates.</p>
                </div>
                <div className="flex bg-white p-2 rounded-[28px] border border-gray-100 shadow-sm">
                    <div className="px-8 py-3 bg-gray-900 text-white rounded-[22px] text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                        <LayoutGrid size={16} /> Grid View
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[350px] bg-white rounded-[48px] border border-gray-100 animate-pulse"></div>
                    ))}
                </div>
            ) : applications?.length === 0 ? (
                <div className="bg-white rounded-[56px] border border-gray-100 p-24 text-center max-w-4xl mx-auto shadow-sm">
                    <div className="w-24 h-24 rounded-[32px] bg-purple-50 flex items-center justify-center text-purple-500 mx-auto mb-10">
                        <Target size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">No Active Applications</h2>
                    <p className="text-gray-400 font-medium max-w-md mx-auto text-lg leading-relaxed mb-10">You haven't applied to any campaigns yet. Explore the marketplace to find your next partnership!</p>
                    <Link href="/campaigns" className="inline-flex items-center gap-2 px-10 py-4 bg-purple-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all shadow-xl shadow-purple-100">
                        Browse Campaigns <ArrowUpRight size={18} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/40 transition-all group relative overflow-hidden flex flex-col h-full">
                            <div className="p-10 flex-grow space-y-8">
                                <div className="flex items-start justify-between">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Briefcase size={28} />
                                    </div>
                                    <div className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${getStatusStyles(app.status)}`}>
                                        {getStatusIcon(app.status)}
                                        {app.status}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight line-clamp-2 min-h-[64px] group-hover:text-blue-600 transition-colors">
                                        {app.campaignId?.title || "Campaign Unavailable"}
                                    </h3>
                                    <div className="flex items-center gap-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                        <Calendar size={14} className="text-indigo-400" />
                                        Applied {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Pitch</p>
                                    <p className="text-sm font-medium text-gray-600 line-clamp-3 leading-relaxed">
                                        {app.message || "No pitch message provided."}
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 border-t border-gray-50 mt-auto">
                                <Link
                                    href={`/campaigns/${app.campaignId?._id}`}
                                    className="flex items-center justify-between group/link"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover/link:text-gray-900 transition-colors">View Campaign Rules</span>
                                    <ArrowUpRight size={20} className="text-gray-300 group-hover/link:text-blue-500 transition-colors" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
