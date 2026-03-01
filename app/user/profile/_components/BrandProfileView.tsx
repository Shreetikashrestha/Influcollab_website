"use client";

import React from 'react';
import { Building2, MapPin, Globe, Instagram, Briefcase, Users, FileText, Settings, ShieldCheck, PieChart, Target } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

// Custom TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
);

// Custom Facebook Icon
const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

interface BrandProfileViewProps {
    user: any;
    profile: any;
    onEdit: () => void;
    brandStats?: any;
    campaigns?: any[];
}

export const BrandProfileView = ({ user, profile, onEdit, brandStats, campaigns }: BrandProfileViewProps) => {
    const totalCampaigns = brandStats?.totalCampaigns ?? '—';
    const totalBudget = brandStats?.totalBudgetAllocated ?? 0;
    const acceptedInfluencers = brandStats?.acceptedInfluencers ?? '—';
    const totalApplicants = brandStats?.totalApplicants ?? '—';

    // Resolve logo URL: backend stores relative paths like /uploads/logo.png
    const resolvedLogoUrl = profile?.logo
        ? (profile.logo.startsWith('/uploads') ? `${BACKEND_URL}${profile.logo}` : profile.logo)
        : null;

    const formatBudget = (val: number) => {
        if (val >= 1000000) return `NPR ${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `NPR ${(val / 1000).toFixed(1)}K`;
        return `NPR ${val}`;
    };

    const stats = [
        { label: 'Total Campaigns', value: totalCampaigns, icon: Briefcase, color: 'text-blue-600' },
        { label: 'Budget Allocated', value: typeof totalBudget === 'number' ? formatBudget(totalBudget) : '—', icon: PieChart, color: 'text-green-600' },
        { label: 'Active Influencers', value: acceptedInfluencers, icon: Users, color: 'text-indigo-600' },
        { label: 'Applications', value: totalApplicants, icon: FileText, color: 'text-orange-600' },
    ];

    // Use the most recent active campaigns from props (max 3)
    const activeCampaigns = (campaigns || [])
        .filter((c: any) => c.status === 'active')
        .slice(0, 3);

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl overflow-hidden relative mb-8">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl -mr-40 -mt-40 opacity-70"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <div className="w-40 h-40 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-lg">
                        {resolvedLogoUrl ? (
                            <img src={resolvedLogoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                        ) : (
                            <Building2 className="w-16 h-16 text-gray-300" />
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-4xl font-black text-gray-900">{profile?.companyName || user.fullName}</h1>
                            {profile?.isVerified && (
                                <div className="bg-blue-100 text-blue-600 p-1 rounded-lg">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                        <p className="text-gray-500 font-medium mb-4 flex items-center justify-center md:justify-start">
                            <Briefcase className="w-4 h-4 mr-2" /> {profile?.industry || 'Industry not set'}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 text-sm mb-6">
                            <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" /> 
                                {profile?.headquarters?.city && profile?.headquarters?.country 
                                    ? `${profile.headquarters.city}, ${profile.headquarters.country}`
                                    : profile?.headquarters?.city || profile?.headquarters?.country || 'Location not set'
                                }
                            </span>
                            <span className="flex items-center"><Globe className="w-4 h-4 mr-1" /> {profile?.website || 'No website'}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start space-x-3">
                            <button
                                onClick={onEdit}
                                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                            >
                                Edit Brand Profile
                            </button>
                            <button className="p-3 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all">
                                <Settings className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="hidden xl:flex flex-col space-y-3 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Subscription</p>
                        <p className="text-xl font-black text-blue-700 capitalize">{profile?.subscriptionTier || 'Free'}</p>
                        <button className="text-xs font-bold text-blue-600 hover:underline">Upgrade Plan →</button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => {
                    const isApplications = s.label === 'Applications';
                    
                    if (isApplications) {
                        return (
                            <Link 
                                key={i} 
                                href="/applications"
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                            >
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <s.icon className={`w-4 h-4 ${s.color}`} />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                                </div>
                                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                            </Link>
                        );
                    }
                    
                    return (
                        <div 
                            key={i} 
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <s.icon className={`w-4 h-4 ${s.color}`} />
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                            </div>
                            <p className="text-2xl font-black text-gray-900">{s.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Content Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">About the Company</h3>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            {profile?.description || 'Add a company description to attract the best influencers for your campaigns.'}
                        </p>

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Social Presence</h3>
                            <button
                                onClick={onEdit}
                                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Edit Links
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { name: 'Instagram', icon: Instagram, color: 'text-pink-600', link: profile?.socialLinks?.instagram },
                                { name: 'TikTok', icon: TikTokIcon, color: 'text-black', link: profile?.socialLinks?.tiktok },
                                { name: 'Facebook', icon: FacebookIcon, color: 'text-blue-700', link: profile?.socialLinks?.facebook },
                            ].map((social) => {
                                if (!social.link) {
                                    return (
                                        <div
                                            key={social.name}
                                            className="flex items-center p-4 bg-gray-50 rounded-2xl border border-transparent opacity-50"
                                        >
                                            <social.icon className={`w-5 h-5 ${social.color} mr-3`} />
                                            <span className="text-sm font-bold text-gray-400">Not Connected</span>
                                        </div>
                                    );
                                }
                                
                                // Ensure URL has protocol
                                const url = social.link.startsWith('http') ? social.link : `https://${social.link}`;
                                
                                return (
                                    <a
                                        key={social.name}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-300 hover:shadow-md transition-all group"
                                    >
                                        <social.icon className={`w-5 h-5 ${social.color} mr-3 group-hover:scale-110 transition-transform`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-400 uppercase">{social.name}</p>
                                            <p className="text-sm font-bold text-gray-700 truncate">
                                                {social.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                            </p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Active Campaigns</h3>
                            <Link href="/brand" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {activeCampaigns.length > 0 ? (
                                activeCampaigns.map((c: any) => (
                                    <Link
                                        key={c._id}
                                        href={`/campaigns/${c._id}`}
                                        className="flex items-center p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
                                    >
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                            <Briefcase className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{c.title}</h4>
                                            <p className="text-xs text-gray-500">
                                                {c.createdAt ? `Created ${format(new Date(c.createdAt), 'MMM d, yyyy')}` : ''}
                                                {' • '}{c.applicantsCount || 0} Applicants
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100">ACTIVE</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 text-sm mb-3">No active campaigns</p>
                                    <Link href="/campaigns/create" className="text-sm font-bold text-blue-600 hover:underline">
                                        Create your first campaign →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
                        <h4 className="text-xl font-bold mb-2">Need Help?</h4>
                        <p className="text-blue-100 text-xs mb-6 opacity-80">Our dedicated brand success team is here to help you scale your influencer marketing efforts.</p>
                        <Link href="/settings?section=help" className="block w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all text-center">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
