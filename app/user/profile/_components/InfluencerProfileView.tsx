"use client";

import React, { useState } from 'react';
import { UserCircle, MapPin, Instagram, Youtube, Twitter, Facebook, Star, Users, BarChart3, Image as ImageIcon, Settings, Heart, Clock, CheckCircle2, Camera, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useRef } from 'react';
import { updateUserProfile } from '@/lib/api/auth';
import { fetchInfluencerStats } from '@/lib/api/application';
import { fetchUserReviews } from '@/lib/api/review';
import { toast } from 'react-toastify';

import { useAuth } from '@/context/AuthContext';

export const InfluencerProfileView = ({ user, profile, onEdit, onUpdate }: { user: any, profile: any, onEdit: () => void, onUpdate: () => void }) => {
    const { refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [isUploading, setIsUploading] = useState(false);
    const [campaignStats, setCampaignStats] = useState({ totalApplications: 0, activeCampaigns: 0, completedCampaigns: 0 });
    const [reviews, setReviews] = useState<any[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch stats
                const statsRes = await fetchInfluencerStats();
                if (statsRes.success) {
                    setCampaignStats(statsRes.data);
                }

                // Fetch reviews if we have a user ID (from prop user)
                if (user?._id) {
                    setLoadingReviews(true);
                    const reviewsRes = await fetchUserReviews(user._id);
                    if (reviewsRes.success) {
                        setReviews(reviewsRes.data);
                    }
                    setLoadingReviews(false);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
                setLoadingReviews(false);
            }
        };
        loadData();
    }, [user?._id]);

    // Calculate profile completion
    const calculateCompletion = () => {
        let basicInfoScore = 0;
        let socialScore = 0;
        let portfolioScore = 0;

        // Basic Info (40 points total)
        if (user?.fullName) basicInfoScore += 10;
        if (user?.email) basicInfoScore += 10;
        if (profile?.bio) basicInfoScore += 10;
        if (profile?.location?.city && profile?.location?.country) basicInfoScore += 10;

        // Social Accounts (30 points total)
        if (profile?.socialAccounts && profile.socialAccounts.length > 0) {
            socialScore = Math.min(30, profile.socialAccounts.length * 10);
        }

        // Portfolio (30 points total)
        if (profile?.portfolio && profile.portfolio.length > 0) {
            portfolioScore = Math.min(30, profile.portfolio.length * 10);
        }

        const total = basicInfoScore + socialScore + portfolioScore;
        
        return {
            total,
            basicInfo: (basicInfoScore / 40) * 100,
            social: (socialScore / 30) * 100,
            portfolio: (portfolioScore / 30) * 100,
            label: total >= 90 ? 'Excellent' : total >= 70 ? 'Good' : total >= 50 ? 'Fair' : 'Incomplete'
        };
    };

    const completion = calculateCompletion();

    const totalFollowers = profile?.socialAccounts?.reduce((acc: number, curr: any) => acc + curr.followers, 0) || 0;
    const avgEngagement = profile?.socialAccounts?.length > 0
        ? (profile.socialAccounts.reduce((acc: number, curr: any) => acc + curr.engagementRate, 0) / profile.socialAccounts.length).toFixed(1)
        : '0.0';

    // Use profile.avgRating if available, otherwise 0.
    const rating = profile?.avgRating || 0;
    const reviewCount = profile?.reviewCount || 0;

    const stats = [
        { label: 'Followers', value: totalFollowers >= 1000 ? `${(totalFollowers / 1000).toFixed(1)}K` : totalFollowers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Engagement', value: `${avgEngagement}%`, icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
        { label: 'Rating', value: rating.toFixed(1), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Campaigns', value: campaignStats.totalApplications, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 mb-8 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>

                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10">
                    <div className="relative group">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-40 h-40 rounded-3xl overflow-hidden bg-gray-100 border-4 border-white shadow-xl relative cursor-pointer group"
                        >
                            {user?.profilePicture ? (
                                <img src={(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050') + user.profilePicture} alt="Profile" className="w-full h-full object-cover group-hover:opacity-75 transition-all" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <UserCircle className="w-24 h-24" />
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                                {isUploading ? (
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                ) : (
                                    <Camera className="w-8 h-8 text-white" />
                                )}
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                try {
                                    setIsUploading(true);
                                    const formData = new FormData();
                                    formData.append('profilePicture', file);
                                    const res: any = await updateUserProfile(formData);
                                    if (res.success) {
                                        toast.success("Profile picture updated!");
                                        await refreshUser();
                                        onUpdate();
                                    }
                                } catch (error: any) {
                                    toast.error(error.message || "Failed to upload image");
                                } finally {
                                    setIsUploading(false);
                                }
                            }}
                        />

                        {profile?.isVerified && (
                            <div className="absolute -top-3 -right-3 bg-blue-600 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">{user.fullName}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 font-medium text-sm mb-4">
                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-blue-500" /> {profile?.location?.city || 'Location not set'}, {profile?.location?.country || ''}</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">@{profile?.username || user.email.split('@')[0]}</span>
                            <span className="flex items-center text-yellow-500"><Star className="w-4 h-4 mr-1 fill-yellow-500" /> {rating.toFixed(1)} ({reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start space-x-3">
                            <button
                                onClick={onEdit}
                                className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                            >
                                Edit Profile
                            </button>
                            <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                                <Settings className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:grid grid-cols-2 gap-4 w-72">
                        {stats.map((s, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
                                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm mb-8 w-fit mx-auto md:mx-0">
                {['overview', 'portfolio', 'statistics', 'reviews'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info Card */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'overview' && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">About Me</h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {profile?.bio || 'No bio available yet. Tell brands about yourself!'}
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mb-6">Categories & Niches</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categories</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profile?.categories && profile.categories.length > 0 ? (
                                            profile.categories.map((cat: string) => (
                                                <span key={cat} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold border border-blue-100">
                                                    {cat}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400">No categories selected yet</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Niches</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profile?.niches && profile.niches.length > 0 ? (
                                            profile.niches.map((niche: string) => (
                                                <span key={niche} className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold border border-purple-100">
                                                    {niche}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400">No niches selected yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-6">Social Accounts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile?.socialAccounts?.length > 0 ? profile.socialAccounts.map((acc: any) => (
                                    <div key={acc.platform} className="p-5 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-3 group-hover:bg-blue-50 transition-all">
                                                {acc.platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
                                                {acc.platform === 'youtube' && <Youtube className="w-5 h-5 text-red-600" />}
                                                {acc.platform === 'twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{acc.platform}</p>
                                                <p className="text-sm font-bold text-gray-900">@{acc.handle}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-gray-900">{(acc.followers / 1000).toFixed(1)}K</p>
                                            <p className="text-[10px] font-medium text-gray-400">Followers</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-400 text-sm">No social accounts connected</p>
                                )}
                            </div>

                            <div className="mt-12">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 ">Portfolio Highlights</h3>
                                    <button
                                        onClick={() => setActiveTab('portfolio')}
                                        className="text-sm font-bold text-blue-600 hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                                {profile?.portfolio && profile.portfolio.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {profile.portfolio.slice(0, 2).map((item: any, i: number) => (
                                            <div key={i} className="group relative aspect-video rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                                                {item.media && item.media[0] ? (
                                                    <img src={process.env.NEXT_PUBLIC_API_BASE_URL + item.media[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ImageIcon className="w-12 h-12 opacity-20" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all z-10 flex items-end p-6">
                                                    <p className="text-white font-bold text-sm">{item.title || "Untitled Project"}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 border border-dashed border-gray-100 rounded-3xl text-center bg-gray-50/30">
                                        <p className="text-sm text-gray-400 font-medium">No portfolio items added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                        <div>
                            {profile?.portfolio && profile.portfolio.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {profile.portfolio.map((item: any, i: number) => (
                                        <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group">
                                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                                {item.media && item.media[0] ? (
                                                    <img src={process.env.NEXT_PUBLIC_API_BASE_URL + item.media[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ImageIcon className="w-12 h-12 opacity-20" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                                                    <button className="p-3 bg-white rounded-full shadow-xl">
                                                        <ExternalLink className="w-5 h-5 text-gray-900" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="font-bold text-gray-900 mb-2">{item.title || "Untitled Project"}</h4>
                                                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.description || "No description provided."}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.tags?.map((tag: string) => (
                                                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl p-12 border border-dashed border-gray-200 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <ImageIcon className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Showcase Your Work</h4>
                                    <p className="text-gray-500 max-w-sm mx-auto mb-6 text-sm">Add your past campaign collaborations and projects to attract more brands.</p>
                                    <button onClick={onEdit} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                                        Add to Portfolio
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'statistics' && (
                        <div className="space-y-8">
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-8">Performance Analytics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                                                <Users className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 mb-1">Total Reach</p>
                                        <p className="text-3xl font-black text-gray-900">{totalFollowers >= 1000 ? `${(totalFollowers / 1000).toFixed(1)}K` : totalFollowers}</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-pink-50 border border-pink-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2 bg-white rounded-xl text-pink-600 shadow-sm">
                                                <Heart className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 mb-1">Average Engagement</p>
                                        <p className="text-3xl font-black text-gray-900">{avgEngagement}%</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-50">
                                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Audience Demographics</h4>
                                    {profile?.audienceDemographics && profile.audienceDemographics.length > 0 ? (
                                        <div className="space-y-4">
                                            {profile.audienceDemographics.map((d: any, i: number) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <span className="text-xs font-bold text-gray-600 w-24 whitespace-nowrap">{d.label}</span>
                                                    <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${d.percentage}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-black text-gray-900 w-10">{d.percentage}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 text-center py-4">No audience demographics data available. Update your profile to add this information.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-6">
                            {loadingReviews ? (
                                <div className="flex justify-center p-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                            ) : reviews.length > 0 ? (
                                reviews.map((review: any) => (
                                    <div key={review._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden mr-3">
                                                    {review.reviewerId?.profilePicture ? (
                                                        <img
                                                            src={(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050') + review.reviewerId.profilePicture}
                                                            alt={review.reviewerId.fullName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <UserCircle className="w-full h-full text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{review.reviewerId?.fullName || "Anonymous Brand"}</h4>
                                                    <p className="text-xs text-gray-500">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-1" />
                                                <span className="text-xs font-bold text-yellow-700">{review.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                            {review.comment}
                                        </p>
                                        <div className="px-3 py-1.5 bg-gray-50 rounded-lg inline-block">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Campaign: {review.campaignId?.title || "Unknown Campaign"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center">
                                    <div className="w-20 h-20 bg-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-yellow-600">
                                        <Star className="w-10 h-10 fill-yellow-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">No Reviews Yet</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">Complete campaigns to receive ratings and reviews from brands. High ratings help you secure more collaborations.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl shadow-gray-200">
                        <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => setActiveTab('statistics')}
                                className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-white/5 flex items-center justify-center"
                            >
                                <BarChart3 className="w-5 h-5 mr-3" /> View Insights
                            </button>
                            <button
                                onClick={() => setActiveTab('portfolio')}
                                className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-white/5 flex items-center justify-center"
                            >
                                <ImageIcon className="w-5 h-5 mr-3" /> Update Portfolio
                            </button>
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Account Health</p>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${completion.total >= 90 ? 'from-green-400 to-blue-500' : completion.total >= 70 ? 'from-yellow-400 to-green-500' : 'from-orange-400 to-yellow-500'}`} style={{ width: `${completion.total}%` }}></div>
                                </div>
                                <p className={`text-right text-[10px] mt-1 font-bold ${completion.total >= 90 ? 'text-green-400' : completion.total >= 70 ? 'text-yellow-400' : 'text-orange-400'}`}>{completion.label}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Completion</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    {completion.basicInfo === 100 ? (
                                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                                    )}
                                    Basic Info
                                </span>
                                <span className="font-bold text-gray-900">{Math.round(completion.basicInfo)}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    {completion.social >= 80 ? (
                                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                                    )}
                                    Social Accounts
                                </span>
                                <span className="font-bold text-gray-900">{Math.round(completion.social)}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center">
                                    {completion.portfolio >= 80 ? (
                                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                                    )}
                                    Portfolio
                                </span>
                                <span className="font-bold text-gray-900">{Math.round(completion.portfolio)}%</span>
                            </div>
                            <button 
                                onClick={onEdit}
                                className="w-full mt-4 py-3 text-blue-600 font-bold text-sm bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
                            >
                                Complete Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal icons needed
const ExternalLink = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
);
