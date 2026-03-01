"use client";

import React, { useState, useEffect, use } from 'react';
import { fetchUserProfile } from '@/lib/api/profile';
import { useAuth } from '@/context/AuthContext';
import {
    MapPin,
    Star,
    CheckCircle2,
    MessageSquare,
    Instagram,
    Twitter,
    Facebook,
    Globe,
    ArrowLeft,
    Share2,
    BarChart3,
    Award,
    Hash,
    UserCircle,
    Plus
} from "lucide-react";
import Link from "next/link";
import { toast } from 'react-toastify';

export default function InfluencerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetchUserProfile(id);
                if (res.success) {
                    setProfile(res.profile);
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load influencer profile");
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <UserCircle className="w-10 h-10 text-gray-200" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                <p className="text-gray-500 max-w-sm mb-8">
                    The creator you're looking for might have removed their profile or changed their username.
                </p>
                <Link href="/influencers" className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-bold">
                    Back to Discovery
                </Link>
            </div>
        );
    }

    const { userId: user, socialAccounts = [], portfolio = [], niches = [], location = {} } = profile;
    const primaryAccount = socialAccounts.find((a: any) => a.isPrimary) || socialAccounts[0];

    return (
        <div className="bg-[#fafaff] min-h-screen">
            {/* Navigation Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/influencers" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="font-black text-slate-800 tracking-tight">Creator Profile</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Info Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-purple-600 to-indigo-600 opacity-[0.03]" />

                            <div className="relative flex flex-col items-center">
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl ring-1 ring-purple-100">
                                        {user?.profilePicture ? (
                                            <img
                                                src={user.profilePicture.startsWith('/uploads') ? `${BACKEND_URL}${user.profilePicture}` : user.profilePicture}
                                                alt={user.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                                                <span className="text-4xl font-black text-purple-300">{user?.fullName?.[0] || 'U'}</span>
                                            </div>
                                        )}
                                    </div>
                                    {profile.isVerified && (
                                        <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl p-1 shadow-lg">
                                            <CheckCircle2 className="w-8 h-8 text-blue-500 fill-blue-50" />
                                        </div>
                                    )}
                                </div>

                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 mb-1">{user?.fullName}</h2>
                                    <p className="text-purple-600 font-bold">@{profile.username}</p>

                                    <div className="flex items-center justify-center gap-2 mt-2 text-slate-400 font-medium text-sm">
                                        <MapPin size={14} className="text-slate-300" />
                                        <span>{location.city ? `${location.city}, ${location.country}` : 'Remote'}</span>
                                    </div>
                                </div>

                                <div className="w-full flex gap-3 mb-8">
                                    <Link
                                        href={`/messages?userId=${user?._id}`}
                                        className="flex-1 bg-slate-900 text-white font-black py-4 rounded-2xl text-center shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare size={18} /> Message
                                    </Link>
                                    <button className="px-5 bg-white border border-gray-100 text-slate-400 rounded-2xl shadow-sm hover:border-purple-200 hover:text-purple-600 transition-all">
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="w-full grid grid-cols-3 gap-2 py-6 border-t border-gray-50">
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Followers</p>
                                        <p className="text-lg font-black text-slate-900">{primaryAccount?.followers ? (primaryAccount.followers / 1000).toFixed(1) + 'K' : '—'}</p>
                                    </div>
                                    <div className="text-center border-x border-gray-50">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Engagement</p>
                                        <p className="text-lg font-black text-slate-900">{primaryAccount?.engagementRate ? primaryAccount.engagementRate + '%' : '—'}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rating</p>
                                        <p className="text-lg font-black text-slate-900 flex items-center justify-center gap-1">
                                            {profile.avgRating.toFixed(1)} <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-purple-600" /> Social Accounts
                            </h3>
                            <div className="space-y-3">
                                {socialAccounts.map((account: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group hover:bg-white hover:ring-1 hover:ring-purple-100 transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                                {account.platform === 'instagram' && <Instagram className="text-pink-600 w-5 h-5" />}
                                                {account.platform === 'twitter' && <Twitter className="text-blue-400 w-5 h-5" />}
                                                {account.platform === 'facebook' && <Facebook className="text-blue-600 w-5 h-5" />}
                                                {!['instagram', 'twitter', 'facebook'].includes(account.platform) && <Globe className="text-slate-400 w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">@{account.handle}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{account.platform}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-slate-700">{(account.followers / 1000).toFixed(1)}K</p>
                                            <p className="text-[10px] font-bold text-green-500">{account.engagementRate}%</p>
                                        </div>
                                    </div>
                                ))}
                                {socialAccounts.length === 0 && <p className="text-xs text-slate-400 font-medium italic">No social accounts linked</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bio & Portfolio */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bio & Categories */}
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">About the Creator</h3>
                                <div className="flex gap-2">
                                    {profile.categories.map((cat: string, i: number) => (
                                        <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-500 leading-relaxed font-medium mb-8">
                                {profile.bio || "This creator hasn't added a bio yet, but their work speaks for itself! Reach out to discuss collaboration opportunities."}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {niches.map((niche: string, i: number) => (
                                    <div key={i} className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-100">
                                        <Hash size={12} className="text-slate-300" />
                                        {niche}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Highlights Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Portfolio Highlights</h3>
                                <div className="flex gap-4">
                                    <button className="text-sm font-bold text-purple-600 hover:text-purple-700">View All</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {portfolio.length > 0 ? (
                                    portfolio.flatMap((p: any) => p.media).map((img: string, idx: number) => (
                                        <div key={idx} className="aspect-square bg-slate-100 rounded-[24px] overflow-hidden group cursor-pointer relative shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                            <img
                                                src={img.startsWith('/uploads') ? `${BACKEND_URL}${img}` : img}
                                                alt={`Portfolio ${idx}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Award className="text-white w-8 h-8 opacity-50" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-100 rounded-[24px] flex items-center justify-center text-slate-200">
                                            <Plus size={32} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}
