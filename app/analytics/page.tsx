"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchBrandStats } from '@/lib/api/campaign';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    TrendingUp,
    Users,
    Target,
    DollarSign,
    ArrowUpRight,
    Download,
    Briefcase
} from 'lucide-react';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchBrandStats();
                if (res.success) {
                    setStats(res.data);
                }
            } catch (err) {
                console.error("Failed to load analytics data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const totalCampaigns = stats?.totalCampaigns || 0;
    const activeCampaigns = stats?.activeCampaigns || 0;
    const totalBudget = stats?.totalBudgetAllocated || 0;
    const totalApplicants = stats?.totalApplicants || 0;
    const acceptedInfluencers = stats?.acceptedInfluencers || 0;
    const categoryData = stats?.campaignsByCategory || [];
    const recentCampaigns: any[] = stats?.recentCampaigns || [];

    // Chart data from real campaigns
    const chartData = recentCampaigns.map((c: any) => ({
        name: c.title?.length > 12 ? c.title.substring(0, 12) + '…' : c.title,
        budget: c.budgetMax || 0,
        applicants: c.applicantsCount || 0,
    }));

    // Format budget for display
    const formatBudget = (val: number) => {
        if (val >= 1000000) return `NPR ${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `NPR ${(val / 1000).toFixed(1)}K`;
        return `NPR ${val}`;
    };

    return (
        <div className="bg-[#fcfcfd] min-h-screen px-8 py-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Performance Analytics</h1>
                    <p className="text-slate-400 font-medium">Detailed insights across all your influencer campaigns.</p>
                </div>
            </header>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "Total Campaigns", value: totalCampaigns, sub: `${activeCampaigns} active`, icon: Briefcase, color: "purple" },
                    { label: "Budget Allocated", value: formatBudget(totalBudget), sub: "combined max budget", icon: DollarSign, color: "green" },
                    { label: "Total Applicants", value: totalApplicants, sub: "across all campaigns", icon: Target, color: "blue" },
                    { label: "Accepted Influencers", value: acceptedInfluencers, sub: "collaborations", icon: Users, color: "orange" },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-${kpi.color}-50 rounded-2xl`}>
                                <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                        <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
                        <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Main Growth Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-slate-900">Budget vs Applications per Campaign</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-600" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Budget</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Applicants</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    />
                                    <Area yAxisId="left" type="monotone" dataKey="budget" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorBudget)" />
                                    <Area yAxisId="right" type="monotone" dataKey="applicants" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorApplicants)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">No campaign data available for chart</div>
                        )}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 mb-2">Campaign Niches</h3>
                    <p className="text-xs text-slate-400 font-medium mb-8">Focus area distribution</p>

                    <div className="flex-1 flex flex-col items-center justify-center">
                        {categoryData.length > 0 ? (
                            <>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={8}
                                                dataKey="value"
                                            >
                                                {categoryData.map((_entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="w-full mt-6 space-y-3">
                                    {categoryData.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                <span className="text-xs font-bold text-slate-600">{item.name}</span>
                                            </div>
                                            <span className="text-xs font-black text-slate-900">
                                                {totalCampaigns > 0 ? Math.round((item.value / totalCampaigns) * 100) : 0}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-slate-400">No campaigns yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Campaign Performance List */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900">Campaign Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicants</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentCampaigns.length > 0 ? (
                                recentCampaigns.map((c: any) => (
                                    <tr key={c._id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-6 font-bold text-slate-800">{c.title}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${c.status === 'active' ? 'bg-green-50 text-green-600' : c.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-medium text-slate-500">{c.category || '—'}</td>
                                        <td className="px-8 py-6 font-bold text-slate-800">NPR {c.budgetMax?.toLocaleString()}</td>
                                        <td className="px-8 py-6 font-bold text-slate-600">{c.applicantsCount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400">No campaigns to display</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
