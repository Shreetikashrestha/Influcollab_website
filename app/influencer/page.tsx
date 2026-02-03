import { handleFetchCampaigns } from "@/lib/actions/campaign-action";
import { handleWhoAmI } from "@/lib/actions/auth-action";
import {
    Bell,
    Megaphone,
    Bookmark,
    Heart,
    Banknote
} from "lucide-react";
import DashboardStatCard from "@/components/DashboardStatCard";
import CampaignCard from "@/components/CampaignCard";

export default async function InfluencerDashboard() {
    const campaignsRes = (await handleFetchCampaigns()) as any;
    const userRes = (await handleWhoAmI()) as any;

    const user = userRes?.data;
    const allCampaigns = campaignsRes?.success ? (campaignsRes.data || []) : [];

    // Safety check: ensure allCampaigns is an array
    const campaignsArray = Array.isArray(allCampaigns) ? allCampaigns : [];

    // Filter campaigns the influencer has applied to (for stats or secondary list)
    const myApplications = campaignsArray.filter((c: any) =>
        c.applicants?.some((app: any) => app.user === user?._id)
    );

    // Mock stats based on Figma
    const stats = [
        { name: "Available Campaigns", value: campaignsArray.length, icon: <Megaphone className="w-6 h-6 text-purple-600" /> },
        { name: "Saved", value: 0, icon: <Bookmark className="w-6 h-6 text-purple-600" /> },
        { name: "Liked", value: 0, icon: <Heart className="w-6 h-6 text-purple-600" /> },
        { name: "Total Opportunities", value: "NPR 500K+", icon: <Banknote className="w-6 h-6 text-purple-600" /> },
    ];

    return (
        <div className="bg-[#fcfcfd] min-h-screen px-8 py-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-[32px] font-black text-slate-900 tracking-tight">Home</h1>
                <div className="flex items-center gap-4">
                    <button className="relative p-3.5 bg-white shadow-sm rounded-2xl text-slate-400 hover:text-purple-600 hover:shadow-md transition-all border border-slate-50">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 bg-white p-2 pr-4 shadow-sm rounded-full hover:shadow-md transition-all cursor-pointer border border-slate-50">
                        <div className="w-9 h-9 rounded-full bg-auth-gradient p-[1px]">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-white">
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{user?.fullName?.split(' ')[0] || 'User'}</span>
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat) => (
                    <DashboardStatCard
                        key={stat.name}
                        title={stat.name}
                        value={stat.value}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {/* Campaign Grid Section */}
            <section>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Recommended for You</h2>
                        <p className="text-[14px] font-medium text-slate-400">Personalized campaign opportunities based on your profile.</p>
                    </div>
                </div>

                {campaignsArray.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Megaphone className="w-8 h-8 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">No campaigns found</h3>
                        <p className="text-sm text-slate-400 font-medium">Try checking back later for more opportunities.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
                        {campaignsArray.map((campaign: any) => (
                            <CampaignCard
                                key={campaign._id}
                                id={campaign._id}
                                title={campaign.title}
                                brand={campaign.brandName || campaign.brand || "Brand Name"}
                                category={campaign.category || "Fashion"}
                                reward={`NPR ${campaign.budget || campaign.budgetRange || "Flexible"}`}
                                deadline={campaign.deadline ? new Date(campaign.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "No deadline"}
                                location={campaign.location || "Remote"}
                                applicants={campaign.applicants?.length || 0}
                                description={campaign.description}
                                image={campaign.image}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>

    );
}
