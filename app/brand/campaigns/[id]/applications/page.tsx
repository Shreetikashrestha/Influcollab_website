"use client";

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { fetchCampaignApplications, updateApplicationStatus } from '@/lib/api/application';
import { fetchCampaignDetails } from '@/lib/api/campaign';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
    Check,
    X,
    ArrowLeft,
    User,
    Mail,
    Instagram,
    Twitter,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CampaignApplicationsPage({ params }: PageProps) {
    const { id } = use(params);
    const [applications, setApplications] = useState<any[]>([]);
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const [appRes, campRes]: [any, any] = await Promise.all([
                fetchCampaignApplications(id),
                fetchCampaignDetails(id)
            ]);

            if (appRes.success) setApplications(Array.isArray(appRes.data) ? appRes.data : []);
            if (campRes.success) setCampaign(campRes.data);
        } catch (err: any) {
            toast.error(err.message || "Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleAction = async (appId: string, status: 'accepted' | 'rejected') => {
        try {
            await updateApplicationStatus(appId, status);
            toast.success(`Application ${status} successfully`);
            loadData();
        } catch (err: any) {
            toast.error(err.message || "Action failed");
        }
    };

    return (
        <div className="p-4 md:p-10 min-h-screen space-y-12">
            <header className="space-y-6">
                <Link
                    href="/brand/campaigns"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-xs uppercase tracking-[0.2em] transition-colors"
                >
                    <ArrowLeft size={16} /> Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100/50">
                            Candidate Review
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">{campaign?.title || "Applications"}</h1>
                        <p className="text-gray-500 font-medium mt-1">Review influencer credentials and proposal fits.</p>
                    </div>
                    <div className="flex bg-white p-2 rounded-[24px] border border-gray-100 shadow-sm">
                        <div className="px-6 py-2 bg-gray-50 text-gray-900 rounded-xl text-[11px] font-black uppercase tracking-widest">
                            {(applications?.length || 0)} Submissions
                        </div>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-white rounded-[40px] border border-gray-100 animate-pulse"></div>
                    ))}
                </div>
            ) : applications?.length === 0 ? (
                <div className="bg-white rounded-[48px] border border-gray-100 p-24 text-center max-w-4xl mx-auto shadow-sm">
                    <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 mx-auto mb-10">
                        <AlertCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">No Candidates Yet</h2>
                    <p className="text-gray-400 font-medium max-w-md mx-auto text-lg leading-relaxed">It might take a few days for influencers to discover your campaign and submit proposals. Keep an eye on your notifications!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all p-8 md:p-12 group">
                            <div className="flex flex-col lg:flex-row gap-10">
                                <div className="flex-grow space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-100">
                                                {app.influencerId?.fullName?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{app.influencerId?.fullName}</h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                        <Mail size={14} className="text-blue-500" /> {app.influencerId?.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' :
                                            app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <ExternalLink size={14} /> Influencer Pitch / Message
                                        </p>
                                        <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100/50 italic text-gray-600 leading-relaxed font-medium">
                                            "{app.message || "No pitch provided. Review user profile for more details."}"
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-[320px] flex flex-col justify-between gap-8 pt-2">
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-4">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Engagement Metrics</p>
                                            <div className="flex items-center justify-around">
                                                <Instagram size={24} className="text-pink-500" />
                                                <Twitter size={24} className="text-blue-400" />
                                                <div className="w-[1px] h-8 bg-gray-100"></div>
                                                <div className="text-center">
                                                    <p className="text-lg font-black text-gray-900 tracking-tight">2.4k</p>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase">Avg Likes</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {app.status === 'pending' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleAction(app._id, 'accepted')}
                                                className="flex flex-col items-center justify-center py-6 bg-emerald-50 text-emerald-600 rounded-[32px] hover:bg-emerald-500 hover:text-white transition-all group/btn border border-emerald-100/50"
                                            >
                                                <CheckCircle2 size={32} className="mb-2 transition-transform group-hover/btn:scale-110" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Hire</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction(app._id, 'rejected')}
                                                className="flex flex-col items-center justify-center py-6 bg-red-50 text-red-600 rounded-[32px] hover:bg-red-500 hover:text-white transition-all group/btn border border-red-100/50"
                                            >
                                                <XCircle size={32} className="mb-2 transition-transform group-hover/btn:scale-110" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Reject</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
