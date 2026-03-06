"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchCampaignDetails } from "@/lib/api/campaign";
import { fetchWhoAmI } from "@/lib/api/auth";
import { fetchUserProfile } from "@/lib/api/profile";
import { submitApplication } from "@/lib/api/application";
import { fetchCampaignApplications, updateApplicationStatus } from "@/lib/api/application";
import { getCampaignImageUrl } from "@/lib/utils/image";
import { Calendar, MapPin, Users, Briefcase, Tag, CheckCircle, Instagram, Edit3, Loader2, UserCheck, X, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

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

export default function CampaignDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [campaign, setCampaign] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [brandProfile, setBrandProfile] = useState<any>(null);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState("");
    const [showApplicantsModal, setShowApplicantsModal] = useState(false);
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [campaignRes, userRes] = await Promise.all([
                fetchCampaignDetails(id),
                fetchWhoAmI()
            ]);

            if (!(campaignRes as any).success) {
                toast.error((campaignRes as any).message || "Failed to load campaign");
                return;
            }

            const campaignData = (campaignRes as any).data;
            const userData = (userRes as any).data;

            setCampaign(campaignData);
            setUser(userData);

            // Check if already applied
            const applied = campaignData.applicants?.some((app: any) => app.user === userData?._id);
            setAlreadyApplied(applied);

            // Fetch brand profile if available
            if (campaignData.creatorId?._id) {
                try {
                    const profileRes = await fetchUserProfile(campaignData.creatorId._id);
                    if (profileRes.success) {
                        setBrandProfile(profileRes.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch brand profile:", error);
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to load campaign");
        } finally {
            setLoading(false);
        }
    };

    const handleApplyNow = async () => {
        if (alreadyApplied) {
            toast.info("You have already applied to this campaign");
            return;
        }

        setShowApplicationModal(true);
    };

    const handleSubmitApplication = async () => {
        if (!applicationMessage.trim()) {
            toast.error("Please enter a message explaining why you're interested");
            return;
        }

        setApplying(true);
        try {
            const response: any = await submitApplication({
                campaignId: id,
                message: applicationMessage
            });

            if (response.success) {
                toast.success("Application submitted successfully!");
                setAlreadyApplied(true);
                setShowApplicationModal(false);
                setApplicationMessage("");
                // Reload campaign data to update applicants count
                loadData();
            } else {
                toast.error(response.message || "Failed to submit application");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to submit application");
        } finally {
            setApplying(false);
        }
    };

    const handleViewApplicants = async () => {
        setShowApplicantsModal(true);
        setLoadingApplicants(true);
        try {
            const response = await fetchCampaignApplications(id);
            if (response.success) {
                setApplicants(response.data || []);
            } else {
                toast.error(response.message || "Failed to load applicants");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to load applicants");
        } finally {
            setLoadingApplicants(false);
        }
    };

    const handleUpdateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
        try {
            const response = await updateApplicationStatus(applicationId, status);
            if (response.success) {
                toast.success(`Application ${status} successfully!`);
                // Refresh applicants list
                handleViewApplicants();
            } else {
                toast.error(response.message || `Failed to ${status} application`);
            }
        } catch (error: any) {
            toast.error(error.message || `Failed to ${status} application`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600">Campaign not found</p>
            </div>
        );
    }

    const isBrand = user?.role === "brand";
    const isOwnCampaign = isBrand && campaign.creatorId?._id === user?._id;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-64 w-full bg-gray-200">
                    {campaign.image ? (
                        <img
                            src={getCampaignImageUrl(campaign.image)}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No Image Available
                        </div>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3">
                                {campaign.category}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900">{campaign.title}</h1>
                        </div>
                        <div className="flex gap-3">
                            {!isBrand && (
                                <button
                                    onClick={handleApplyNow}
                                    disabled={alreadyApplied || applying}
                                    className={`px-8 py-3 rounded-xl font-bold transition-all ${alreadyApplied
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                                        }`}
                                >
                                    {alreadyApplied ? "Already Applied" : "Apply Now"}
                                </button>
                            )}
                            {isOwnCampaign && (
                                <>
                                    <button
                                        onClick={handleViewApplicants}
                                        className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2"
                                    >
                                        <UserCheck className="w-5 h-5" />
                                        View Applicants ({campaign.applicants?.length || 0})
                                    </button>
                                    <Link
                                        href={`/campaigns/${id}/edit`}
                                        className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                                        title="Edit Campaign"
                                    >
                                        <Edit3 className="w-5 h-5" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 py-6 border-y border-gray-50">
                        <div className="flex items-center text-gray-600">
                            <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-400">Deadline</p>
                                <p className="font-medium">{new Date(campaign.deadline).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-400">Location</p>
                                <p className="font-medium">{campaign.location || "Remote"}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Users className="w-5 h-5 mr-3 text-blue-500" />
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-400">Applicants</p>
                                <p className="font-medium">{campaign.applicants?.length || 0} People</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                                Description
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {campaign.description}
                            </p>
                        </section>

                        {campaign.requirements && campaign.requirements.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                    Requirements
                                </h2>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    {(Array.isArray(campaign.requirements) 
                                        ? campaign.requirements 
                                        : campaign.requirements.split('\n')
                                    ).map((req: string, i: number) => (
                                        <li key={i}>{req}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {campaign.deliverables && campaign.deliverables.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <Tag className="w-5 h-5 mr-2 text-purple-600" />
                                    Deliverables
                                </h2>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    {(Array.isArray(campaign.deliverables) 
                                        ? campaign.deliverables 
                                        : campaign.deliverables.split('\n')
                                    ).map((del: string, i: number) => (
                                        <li key={i}>{del}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {brandProfile?.socialLinks && (
                            <section className="bg-gray-50 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Brand Social Presence</h2>
                                    {isOwnCampaign && (
                                        <Link
                                            href="/user/profile"
                                            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            Edit Links
                                        </Link>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { name: 'Instagram', icon: Instagram, color: 'text-pink-600', link: brandProfile.socialLinks.instagram },
                                        { name: 'TikTok', icon: TikTokIcon, color: 'text-black', link: brandProfile.socialLinks.tiktok },
                                        { name: 'Facebook', icon: FacebookIcon, color: 'text-blue-700', link: brandProfile.socialLinks.facebook },
                                    ].map((social) => {
                                        if (!social.link) return null;
                                        
                                        // Ensure URL has protocol
                                        const url = social.link.startsWith('http') ? social.link : `https://${social.link}`;
                                        
                                        return (
                                            <a
                                                key={social.name}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
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
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {showApplicationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Apply to Campaign</h2>
                        <p className="text-gray-600 mb-4">
                            Tell the brand why you're interested in this campaign and what makes you a great fit.
                        </p>
                        <textarea
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                            placeholder="I'm interested in this campaign because..."
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowApplicationModal(false);
                                    setApplicationMessage("");
                                }}
                                disabled={applying}
                                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitApplication}
                                disabled={applying || !applicationMessage.trim()}
                                className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {applying ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Applicants Modal */}
            {showApplicantsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Campaign Applicants</h2>
                            <button
                                onClick={() => setShowApplicantsModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6">
                            {loadingApplicants ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                            ) : applicants.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">No applicants yet</p>
                                    <p className="text-gray-400 text-sm mt-2">Applications will appear here once influencers apply</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {applicants.map((application: any) => (
                                        <div key={application._id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
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
                                                        <p className="text-sm text-gray-500">{application.influencerId?.email}</p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Applied {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
                                                        </p>
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
                                                <div className="bg-white rounded-xl p-4 mb-4">
                                                    <p className="text-sm font-bold text-gray-700 mb-2">Application Message:</p>
                                                    <p className="text-sm text-gray-600 leading-relaxed">{application.proposalMessage}</p>
                                                </div>
                                            )}
                                            
                                            {application.status === 'pending' && (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleUpdateApplicationStatus(application._id, 'accepted')}
                                                        className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateApplicationStatus(application._id, 'rejected')}
                                                        className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
