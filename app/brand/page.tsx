"use client";

import { useState, useEffect } from "react";
import { fetchBrandCampaigns } from "@/lib/api/campaign";
import { useAuth } from "@/context/AuthContext";
import {
    Search,
    Bell,
    ChevronDown,
    Megaphone,
    Users,
    TrendingUp,
    DollarSign,
    Plus,
    Filter,
    BarChart3,
    ArrowUpRight
} from "lucide-react";
import DashboardCta from "@/components/DashboardCta";
import BrandCampaignItem from "@/components/BrandCampaignItem";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function BrandDashboard() {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            const res = await fetchBrandCampaigns() as any;
            if (res.success) {
                setCampaigns(res.campaigns || []);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to load campaigns");
        } finally {
            setLoading(false);
        }
    };

    const filtered = campaigns.filter(c => {
        const matchSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const activeCampaigns = campaigns.filter(c => c.status === "active").length;
    const totalApplicants = campaigns.reduce((acc, c) => acc + (c.applicantsCount || 0), 0);
    const totalBudget = campaigns.reduce((acc, c) => acc + (c.budgetMax || 0), 0);

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
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-white border-none shadow-sm rounded-2xl pl-11 pr-6 py-3.5 text-sm font-semibold text-slate-700 w-80 focus:ring-2 focus:ring-purple-100 placeholder:text-slate-300 transition-all outline-none"
                        />
                    </div>
                    <button className="relative p-3.5 bg-white shadow-sm rounded-2xl text-slate-400 hover:text-purple-600 hover:shadow-md transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <Link
                        href="/campaigns/create"
                        className="flex items-center gap-2 bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-5 py-3.5 rounded-2xl font-bold shadow-lg shadow-purple-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Campaign</span>
                    </Link>

                    <Link href="/user/profile" className="flex items-center gap-3 bg-white p-2 pr-4 shadow-sm rounded-2xl hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-slate-50 ml-2">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                            <img
                                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=6366f1&color=fff`}
                                alt={user?.fullName || "User"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{user?.fullName?.split(' ')[0] || 'User'}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { name: "Active Campaigns", value: loading ? "—" : activeCampaigns, icon: Megaphone, color: "text-purple-600", bg: "bg-purple-50", sub: `${campaigns.length} total` },
                    { name: "Total Applicants", value: loading ? "—" : totalApplicants, icon: Users, color: "text-blue-600", bg: "bg-blue-50", sub: "across all campaigns" },
                    { name: "Budget Allocated", value: loading ? "—" : `NPR ${totalBudget.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50", sub: "combined max budget" },
                    { name: "Campaigns Trend", value: activeCampaigns > 0 ? "Active" : "No Active", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", sub: "current status" },
                ].map((stat) => (
                    <div key={stat.name} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <Link href="/analytics" className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-purple-600 transition-all">
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* CTA Banner */}
            <DashboardCta />

            {/* Campaign Management Section */}
            <section className="mt-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Your Campaigns</h2>
                        <p className="text-sm text-slate-400">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} created</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-50">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Filter</span>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-white border-none shadow-sm rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 focus:ring-2 focus:ring-purple-100 cursor-pointer outline-none"
                        >
                            <option value="all">All Campaigns</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-24 animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Megaphone className="w-8 h-8 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                            {searchTerm ? "No matching campaigns" : "You haven't created any campaigns yet"}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium mb-8">
                            {searchTerm ? "Try a different search term" : "Launch your first campaign to start connecting with top influencers."}
                        </p>
                        {!searchTerm && (
                            <Link
                                href="/campaigns/create"
                                className="inline-flex items-center gap-2 bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-100"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Create Your First Campaign</span>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map((campaign: any) => (
                            <BrandCampaignItem
                                key={campaign._id}
                                id={campaign._id}
                                title={campaign.title}
                                description={campaign.description || ""}
                                status={campaign.status === 'active' ? "Active" : campaign.status === 'completed' ? 'Completed' : 'Draft'}
                                budget={`NPR ${campaign.budgetMin?.toLocaleString()} – ${campaign.budgetMax?.toLocaleString()}`}
                                deadline={campaign.deadline ? format(new Date(campaign.deadline), 'dd MMM yyyy') : '—'}
                                location={campaign.location || "Remote"}
                                category={campaign.category || "General"}
                                applicants={campaign.applicantsCount || 0}
                                views={0}
                                saves={0}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
