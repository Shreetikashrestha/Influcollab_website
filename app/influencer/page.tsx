import { handleFetchCampaigns } from "@/lib/actions/campaign-action";
import { handleWhoAmI } from "@/lib/actions/auth-action";
import {
    Search,
    Bell,
    ChevronDown,
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
    const allCampaigns = campaignsRes?.data || [];

    // Filter campaigns the influencer has applied to (for stats or secondary list)
    const myApplications = allCampaigns.filter((c: any) =>
        c.applicants?.some((app: any) => app.user === user?._id)
    );

    // Stats for influencer dashboard
    const stats = [
        { name: "Available Campaigns", value: allCampaigns.length, icon: "megaphone" },
    ];

    return (
        <div className="bg-[#fcfcfd] min-h-screen px-8 py-6">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Home</h1>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            className="bg-white border-none shadow-sm rounded-2xl pl-11 pr-6 py-3.5 text-sm font-semibold text-slate-700 w-80 focus:ring-2 focus:ring-purple-100 placeholder:text-slate-300 transition-all"
                        />
                    </div>
                    <button className="relative p-3.5 bg-white shadow-sm rounded-2xl text-slate-400 hover:text-purple-600 hover:shadow-md transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 bg-white p-2 pr-4 shadow-sm rounded-2xl hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-slate-50">
                        <div className="w-9 h-9 rounded-xl bg-auth-gradient p-[1px]">
                            <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden border border-white">
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{user?.fullName?.split(' ')[0] || 'User'}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                    <div className="flex gap-3">
                        <select className="bg-white border-none shadow-sm rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 focus:ring-2 focus:ring-purple-100 cursor-pointer">
                            <option>Latest Updates</option>
                            <option>Highest Reward</option>
                        </select>
                    </div>
                </div>

                {allCampaigns.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Megaphone className="w-8 h-8 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">No campaigns found</h3>
                        <p className="text-sm text-slate-400 font-medium">Try checking back later for more opportunities.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {allCampaigns.map((campaign: any) => (
                            <CampaignCard
                                key={campaign._id}
                                id={campaign._id}
                                title={campaign.title}
                                brand={campaign.brandName || "Brand Name"}
                                category={campaign.category || "Fashion"}
                                reward={`NPR ${campaign.budget || campaign.budgetRange || "Flexible"}`}
                                deadline={new Date(campaign.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                location={campaign.location || "Remote"}
                                applicants={campaign.applicants?.length || 0}
                                description={campaign.description}
                                image={campaign.image}
                                href={`/influencer/campaign/${campaign._id}`}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
