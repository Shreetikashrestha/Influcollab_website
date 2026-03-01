"use client";

import React, { useState, useEffect } from 'react';
import { fetchCampaignApplications, updateApplicationStatus } from '@/lib/api/application';
import { createReview } from '@/lib/api/review';
import { fetchBrandCampaigns } from '@/lib/api/campaign';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Users, Loader2, Check, X, Mail, Calendar, Search, FileText, Star } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterCampaign, setFilterCampaign] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [ratingModal, setRatingModal] = useState<{ open: boolean; application: any | null }>({ open: false, application: null });
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const campaignsRes: any = await fetchBrandCampaigns();
            if (campaignsRes.success) {
                const campaignsList = campaignsRes.campaigns || campaignsRes.data || [];
                setCampaigns(campaignsList);

                const allApplications: any[] = [];
                for (const campaign of campaignsList) {
                    try {
                        const appsRes = await fetchCampaignApplications(campaign._id);
                        if (appsRes.success && appsRes.data) {
                            const appsWithCampaign = appsRes.data.map((app: any) => ({
                                ...app,
                                campaign: campaign
                            }));
                            allApplications.push(...appsWithCampaign);
                        }
                    } catch (error) {
                        console.error(`Failed to fetch applications for campaign ${campaign._id}`);
                    }
                }
                setApplications(allApplications);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
        try {
            const response = await updateApplicationStatus(applicationId, status);
            if (response.success) {
                toast.success(`Application ${status} successfully!`);
                loadData();
            } else {
                toast.error(response.message || `Failed to ${status} application`);
            }
        } catch (error: any) {
            toast.error(error.message || `Failed to ${status} application`);
        }
    };

    const handleOpenRatingModal = (application: any) => {
        setRatingModal({ open: true, application });
        setRating(0);
        setComment('');
    };

    const handleCloseRatingModal = () => {
        setRatingModal({ open: false, application: null });
        setRating(0);
        setComment('');
    };

    const handleSubmitRating = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setSubmittingRating(true);
        try {
            const response = await createReview({
                revieweeId: ratingModal.application.influencerId._id,
                campaignId: ratingModal.application.campaign._id,
                rating,
                comment
            });

            if (response.success) {
                toast.success('Rating submitted successfully!');
                handleCloseRatingModal();
                loadData();
            } else {
                toast.error(response.message || 'Failed to submit rating');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit rating');
        } finally {
            setSubmittingRating(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        const matchesCampaign = filterCampaign === 'all' || app.campaign?._id === filterCampaign;
        const matchesSearch = !searchQuery || 
            app.influencerId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.influencerId?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesStatus && matchesCampaign && matchesSearch;
    });

    const stats = [
        { label: 'Total', value: applications.length, color: 'bg-blue-50 text-blue-600' },
        { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: 'bg-yellow-50 text-yellow-600' },
        { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: 'bg-green-50 text-green-600' },
        { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: 'bg-red-50 text-red-600' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">All Applications</h1>
                <p className="text-gray-500 font-medium">Manage influencer applications across all your campaigns</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-3`}>
                            <FileText className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        <p className="text-sm font-bold text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by influencer name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all font-medium"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <select
                        value={filterCampaign}
                        onChange={(e) => setFilterCampaign(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all font-medium"
                    >
                        <option value="all">All Campaigns</option>
                        {campaigns.map(campaign => (
                            <option key={campaign._id} value={campaign._id}>{campaign.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No applications found</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {applications.length === 0 
                                ? 'Applications will appear here once influencers apply to your campaigns'
                                : 'Try adjusting your filters'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredApplications.map((application) => (
                            <div key={application._id} className="p-6 hover:bg-gray-50 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
                                            {application.influencerId?.profilePicture ? (
                                                <img 
                                                    src={application.influencerId.profilePicture} 
                                                    alt={application.influencerId.fullName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                application.influencerId?.fullName?.[0] || 'U'
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {application.influencerId?.fullName || 'Unknown User'}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-4 h-4" />
                                                    {application.influencerId?.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {application.createdAt ? format(new Date(application.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                                </span>
                                            </div>
                                            <Link 
                                                href={`/campaigns/${application.campaign?._id}`}
                                                className="text-sm font-bold text-blue-600 hover:text-blue-700 mt-1 inline-block"
                                            >
                                                Campaign: {application.campaign?.title}
                                            </Link>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        application.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                        application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </span>
                                </div>
                                
                                {application.proposalMessage && (
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <p className="text-sm font-bold text-gray-700 mb-2">Application Message:</p>
                                        <p className="text-sm text-gray-600 leading-relaxed">{application.proposalMessage}</p>
                                    </div>
                                )}
                                
                                {application.status === 'pending' && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleUpdateStatus(application._id, 'accepted')}
                                            className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(application._id, 'rejected')}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                )}
                                
                                {application.status === 'accepted' && (
                                    <button
                                        onClick={() => handleOpenRatingModal(application)}
                                        className="w-full px-4 py-2 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Star className="w-4 h-4" />
                                        Rate Influencer
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rating Modal */}
            {ratingModal.open && ratingModal.application && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Influencer</h2>
                        <div className="mb-4">
                            <p className="text-gray-600 mb-2">
                                Rate your experience with <span className="font-bold">{ratingModal.application.influencerId?.fullName}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Campaign: {ratingModal.application.campaign?.title}
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Rating</label>
                            <div className="flex gap-2 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="transition-all hover:scale-110"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${
                                                star <= rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-center text-sm font-bold text-gray-600 mt-2">
                                    {rating} out of 5 stars
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Comment (Optional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience working with this influencer..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCloseRatingModal}
                                disabled={submittingRating}
                                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitRating}
                                disabled={submittingRating || rating === 0}
                                className="flex-1 px-6 py-3 rounded-xl bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {submittingRating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Rating'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
