import { handleFetchBrandCampaigns } from "@/lib/actions/campaign-action";
import { handleWhoAmI } from "@/lib/actions/auth-action";
import {
    Search,
    Bell,
    ChevronDown,
    Megaphone,
    Users,
    Eye,
    Settings,
    Plus,
    Filter
} from "lucide-react";
import DashboardStatCard from "@/components/DashboardStatCard";
import DashboardCta from "@/components/DashboardCta";
import BrandCampaignItem from "@/components/BrandCampaignItem";
import Link from "next/link";

export default async function BrandDashboard() {
    const campaignsRes = (await handleFetchBrandCampaigns()) as any;
    const userRes = (await handleWhoAmI()) as any;

    const user = userRes?.data;
    const allCampaigns = campaignsRes?.success ? (campaignsRes.data || []) : [];

    // Safety check: ensure allCampaigns is an array
    const myCampaigns = Array.isArray(allCampaigns) ? allCampaigns : [];

    // Calculate real stats
    const activeCampaigns = myCampaigns.filter((c: any) => !c.isCompleted).length;
    const totalApplicants = myCampaigns.reduce((acc: number, curr: any) => acc + (curr.applicants?.length || 0), 0);

    const stats = [
        { name: "Active Campaigns", value: activeCampaigns, icon: <Megaphone className="w-6 h-6 text-purple-600" />, trend: "+2 this month" },
        { name: "Total Applicants", value: totalApplicants, icon: <Users className="w-6 h-6 text-purple-600" />, trend: "+12 this week" },
        { name: "Budget Allocated", value: "$16K", icon: <Eye className="w-6 h-6 text-purple-600" />, trend: "67% of total" }, // Placeholder for now
        { name: "Total Views", value: "254", icon: <Eye className="w-6 h-6 text-purple-600" />, trend: "+45 today" }, // Placeholder for now
    ];

    return (
        <div className="bg-[#fcfcfd] min-h-screen px-8 py-6">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Campaign Dashboard</h1>
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

                    <Link
                        href="/campaigns/create"
                        className="flex items-center gap-2 bg-auth-gradient text-white px-5 py-3.5 rounded-2xl font-bold shadow-lg shadow-purple-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Campaign</span>
                    </Link>

                    <div className="flex items-center gap-3 bg-white p-2 pr-4 shadow-sm rounded-2xl hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-slate-50 ml-2">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                            <img
                                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=random`}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{user?.fullName?.split(' ')[0] || 'User'}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
                        trend={stat.trend}
                    />
                ))}
            </div>

            {/* CTA Banner */}
            <DashboardCta />

            {/* Campaign Management Section */}
            <section>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Your Campaigns</h2>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-50">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Filter</span>
                        </div>
                        <select className="bg-white border-none shadow-sm rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 focus:ring-2 focus:ring-purple-100 cursor-pointer">
                            <option>All Campaigns</option>
                            <option>Active</option>
                            <option>Draft</option>
                        </select>
                    </div>
                </div>

                {myCampaigns.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Megaphone className="w-8 h-8 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">You haven't created any campaigns yet</h3>
                        <p className="text-sm text-slate-400 font-medium mb-8">Launch your first campaign to start connecting with top influencers.</p>
                        <Link
                            href="/campaigns/create"
                            className="inline-flex items-center gap-2 bg-auth-gradient text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-100"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create Your First Campaign</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {myCampaigns.map((campaign: any) => (
                            <BrandCampaignItem
                                key={campaign._id}
                                id={campaign._id}
                                title={campaign.title}
                                description={campaign.description || "Looking for talented influencers to showcase our latest products to their audience. High-quality content production is a must."}
                                status={campaign.isCompleted ? "Completed" : "Active"}
                                budget={`$${campaign.budget || campaign.budgetRange || "Flexible"}`}
                                deadline={new Date(campaign.deadline).toLocaleDateString('en-GB')}
                                location={campaign.location || "Remote"}
                                category={campaign.category || "Fashion"}
                                applicants={campaign.applicants?.length || 0}
                                views={456} // Placeholder
                                saves={23} // Placeholder
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
