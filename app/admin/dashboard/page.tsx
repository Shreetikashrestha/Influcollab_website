"use client";

import React, { useState, useEffect } from 'react';
import {
    Users,
    Megaphone,
    TrendingUp
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { getAllUsers } from '@/lib/api/admin';
import { adminFetchAllCampaigns } from '@/lib/api/application';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeCampaigns: 0,
        userGrowth: '+0%',
        campaignGrowth: '+0%'
    });
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch admin stats
                try {
                    const { getAdminStats } = await import('@/lib/api/admin');
                    const adminStatsRes: any = await getAdminStats();
                    
                    if (adminStatsRes && adminStatsRes.success) {
                        const data = adminStatsRes.data;
                        setStats(prev => ({ 
                            ...prev, 
                            totalUsers: data.totalUsers || 0,
                            userGrowth: data.userGrowth || '+0%'
                        }));
                        
                        // Use real monthly data
                        if (data.monthlyData && data.monthlyData.length > 0) {
                            const chartData = data.monthlyData.slice(0, 6).map((month: any) => ({
                                name: month.name,
                                val: month.total || 0
                            }));
                            setChartData(chartData);
                        }
                    }
                } catch (statsError: any) {
                    console.error('Failed to fetch admin stats:', statsError);
                }

                // Fetch campaigns
                try {
                    const campaignsRes = await adminFetchAllCampaigns({ limit: 1000 });
                    if (campaignsRes && campaignsRes.success) {
                        const activeCampaigns = campaignsRes.campaigns?.filter((c: any) => c.status === 'active').length || 0;
                        const totalCampaigns = campaignsRes.campaigns?.length || 0;
                        const lastMonthCampaigns = campaignsRes.campaigns?.filter((c: any) => {
                            const createdDate = new Date(c.createdAt);
                            const lastMonth = new Date();
                            lastMonth.setMonth(lastMonth.getMonth() - 1);
                            return createdDate >= lastMonth;
                        }).length || 0;
                        
                        const campaignGrowth = totalCampaigns > 0 && lastMonthCampaigns > 0
                            ? `+${((lastMonthCampaigns / totalCampaigns) * 100).toFixed(1)}%`
                            : '+0%';
                        
                        setStats(prev => ({ 
                            ...prev, 
                            activeCampaigns,
                            campaignGrowth
                        }));
                    }
                } catch (campaignError: any) {
                    console.error('Failed to fetch campaigns:', campaignError);
                }

            } catch (error: any) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const STATS = [
        { 
            label: 'Total Users', 
            value: loading ? '...' : stats.totalUsers.toLocaleString(), 
            grow: stats.userGrowth, 
            icon: Users, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
        },
        { 
            label: 'Active Campaigns', 
            value: loading ? '...' : stats.activeCampaigns.toString(), 
            grow: stats.campaignGrowth, 
            icon: Megaphone, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50' 
        }
    ];

    return (
        <div className="p-4 md:p-8 min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Overview</h1>
                    <p className="text-gray-500 text-sm font-medium">Real-time performance and user metrics.</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {STATS.map((s, i) => (
                    <div key={i} className="bg-white p-7 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3.5 rounded-2xl ${s.bg} ${s.color}`}>
                                <s.icon size={26} />
                            </div>
                            <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-lg text-[11px] font-black italic">
                                <TrendingUp size={12} />
                                {s.grow}
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{s.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* Analytics & Activity Row */}
            <div className="grid grid-cols-1 gap-8">
                {/* Chart Section */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-gray-900 text-lg tracking-tight">User Growth Analytics</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Current Year</p>
                        </div>
                        <select className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-none rounded-xl px-4 py-2 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last year</option>
                        </select>
                    </div>
                    <div className="h-[340px] w-full">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F9FAFB' }}
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                            fontSize: '12px',
                                            fontWeight: 800
                                        }}
                                    />
                                    <Bar dataKey="val" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={45} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}