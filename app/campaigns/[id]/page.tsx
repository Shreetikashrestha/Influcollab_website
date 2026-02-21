import { handleFetchCampaignDetails, handleJoinCampaign } from "@/lib/actions/campaign-action";
import { fetchWhoAmI } from "@/lib/api/auth";
import { fetchUserProfile } from "@/lib/api/profile";
import { Calendar, MapPin, Users, Briefcase, Tag, CheckCircle, Instagram, Edit3 } from "lucide-react";
import Link from "next/link";

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

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const campaignRes = (await handleFetchCampaignDetails(id)) as any;
    const userRes = (await fetchWhoAmI()) as any;

    if (!campaignRes.success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600">{campaignRes.message}</p>
            </div>
        );
    }

    const campaign = campaignRes.data;
    const user = userRes.data;
    const isBrand = user?.role === "brand";
    const isOwnCampaign = isBrand && campaign.brand?._id === user?._id;
    const alreadyApplied = campaign.applicants?.some((app: any) => app.user === user?._id);

    // Fetch brand profile if campaign has brand info
    let brandProfile = null;
    if (campaign.brand?._id) {
        try {
            const profileRes = await fetchUserProfile(campaign.brand._id);
            if (profileRes.success) {
                brandProfile = profileRes.data;
            }
        } catch (error) {
            console.error("Failed to fetch brand profile:", error);
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-64 w-full bg-gray-200">
                    {campaign.image ? (
                        <img
                            src={campaign.image}
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
                                <form action={async () => {
                                    "use server";
                                    await handleJoinCampaign(id);
                                }}>
                                    <button
                                        disabled={alreadyApplied}
                                        type="submit"
                                        className={`px-8 py-3 rounded-xl font-bold transition-all ${alreadyApplied
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                                            }`}
                                    >
                                        {alreadyApplied ? "Already Applied" : "Apply Now"}
                                    </button>
                                </form>
                            )}
                            {isOwnCampaign && (
                                <Link
                                    href={`/campaigns/${id}/edit`}
                                    className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                                    title="Edit Campaign"
                                >
                                    <Edit3 className="w-5 h-5" />
                                </Link>
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
                                    ].map((social) => (
                                        social.link ? (
                                            <a
                                                key={social.name}
                                                href={social.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all"
                                            >
                                                <social.icon className={`w-5 h-5 ${social.color} mr-3`} />
                                                <span className="text-sm font-bold text-gray-700">
                                                    {social.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                                </span>
                                            </a>
                                        ) : null
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
