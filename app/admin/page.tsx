"use client";

import React, { useState, useEffect } from 'react';
import {
    Users,
    UserCheck,
    Shield,
    TrendingUp,
    TrendingDown,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    CircleDollarSign
} from 'lucide-react';
import { getAllUsers } from '@/lib/api/admin';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';

// Mock data for charts
const growthData = [
    { name: 'Jan', influencers: 45, brands: 12 },
    { name: 'Feb', influencers: 52, brands: 15 },
    { name: 'Mar', influencers: 48, brands: 10 },
    { name: 'Apr', influencers: 61, brands: 18 },
    { name: 'May', influencers: 55, brands: 22 },
    { name: 'Jun', influencers: 67, brands: 25 },
    { name: 'Jul', influencers: 72, brands: 28 },
    { name: 'Aug', influencers: 85, brands: 30 },
    { name: 'Sep', influencers: 92, brands: 35 },
    { name: 'Oct', influencers: 105, brands: 42 },
    { name: 'Nov', influencers: 118, brands: 45 },
    { name: 'Dec', influencers: 132, brands: 50 },
];

const revenueData = [
    { name: 'Jan', revenue: 4500, fees: 675 },
    { name: 'Feb', revenue: 5200, fees: 780 },
    { name: 'Mar', revenue: 4800, fees: 720 },
    { name: 'Apr', revenue: 6100, fees: 915 },
    { name: 'May', revenue: 5500, fees: 825 },
    { name: 'Jun', revenue: 6700, fees: 1005 },
    { name: 'Jul', revenue: 7200, fees: 1080 },
    { name: 'Aug', revenue: 8500, fees: 1275 },
    { name: 'Sep', revenue: 9200, fees: 1380 },
    { name: 'Oct', revenue: 12000, fees: 1800 },
    { name: 'Nov', revenue: 14500, fees: 2175 },
    { name: 'Dec', revenue: 18200, fees: 2730 },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total: 0,
        influencers: 0,
        brands: 0,
        admins: 0,
        totalRevenue: 0,
        totalVolume: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, paymentRes] = await Promise.all([
                    getAllUsers({ limit: 1000 }),
                    import('@/lib/api/payment').then(m => m.fetchTransactionStats())
                ]) as any;

                if (userRes.success) {
                    const users = userRes.users;
                    setStats((prev: any) => ({
                        ...prev,
                        total: userRes.total,
                        influencers: users.filter((u: any) => u.isInfluencer).length,
                        brands: users.filter((u: any) => !u.isInfluencer && u.role !== 'admin').length,
                        admins: users.filter((u: any) => u.role === 'admin').length
                    }));
                }

                if (paymentRes.success) {
                    setStats((prev: any) => ({
                        ...prev,
                        totalRevenue: paymentRes.stats.totalRevenue,
                        totalVolume: paymentRes.stats.totalVolume
                    }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const cards = [
        {
            title: 'Total Platform Users',
            value: stats.total,
            icon: Users,
            color: 'blue',
            trend: '+12.5%',
            isPositive: true
        },
        {
            title: 'Platform Revenue',
            value: `NPR ${stats.totalRevenue.toLocaleString()}`,
            icon: CircleDollarSign,
            color: 'emerald',
            trend: '+24.2%',
            isPositive: true
        },
        {
            title: 'Total Volume',
            value: `NPR ${stats.totalVolume.toLocaleString()}`,
            icon: TrendingUp,
            color: 'orange',
            trend: '+8.1%',
            isPositive: true
        },
        {
            title: 'System Admins',
            value: stats.admins,
            icon: Shield,
            color: 'red',
            trend: '0%',
            isPositive: true
        }
    ];

    return (
        <div className="p-8 space-y-10">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Overview</h1>
                <p className="text-gray-500 font-medium mt-2">Real-time statistics across the ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group">
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-14 h-14 rounded-2xl bg-${card.color}-50 text-${card.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <card.icon size={28} />
                            </div>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${card.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {card.trend}
                                {card.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                {loading ? '...' : card.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Growth Chart */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">User Acquisition</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">12-Month Bar Chart</p>
                        </div>
                        <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            Growth: +24%
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                    cursor={{ fill: '#f9fafb' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                                <Bar dataKey="influencers" name="Influencers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="brands" name="Brands" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Trend Chart */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Trends</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Platform Fees & Volume</p>
                        </div>
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            NPR {stats.totalRevenue.toLocaleString()} Total
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                                <Area type="monotone" dataKey="revenue" name="Total Volume" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                                <Line type="monotone" dataKey="fees" name="Platform Fees" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Platform Health Section */}
            <div className="bg-gray-900 rounded-[48px] p-12 text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md mb-8">
                            <Activity size={14} className="text-emerald-400" /> System Health
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-6">Your infrastructure is operating at peak efficiency</h2>
                        <p className="text-gray-400 font-medium leading-relaxed text-lg">Platform uptime is at 99.98% for the last 30 days. API response times are averaging 142ms, well within the target threshold.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-all">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Uptime</p>
                            <h4 className="text-2xl font-black text-white tracking-tight">99.9%</h4>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-all">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Response Time</p>
                            <h4 className="text-2xl font-black text-white tracking-tight">142ms</h4>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-all">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Error Rate</p>
                            <h4 className="text-2xl font-black text-white tracking-tight">0.04%</h4>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-all">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Transactions</p>
                            <h4 className="text-2xl font-black text-white tracking-tight">1.2k/hr</h4>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-600/10 blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
}
