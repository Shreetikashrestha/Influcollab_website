"use client";

import React, { useState, useEffect } from 'react';
import {
    Users,
    UserCheck,
    Shield,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight
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
    Legend
} from 'recharts';

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

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total: 0,
        influencers: 0,
        brands: 0,
        admins: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, adminStatsRes] = await Promise.all([
                    getAllUsers({ limit: 1000 }),
                    import('@/lib/api/admin').then(m => m.getAdminStats())
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

                if (adminStatsRes.success && adminStatsRes.data.monthlyData) {
                    const realGrowthData = adminStatsRes.data.monthlyData.map((month: any) => ({
                        name: month.name,
                        influencers: month.influencers,
                        brands: month.brands
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
            title: 'Active Campaigns',
            value: stats.influencers + stats.brands,
            icon: UserCheck,
            color: 'emerald',
            trend: '+18.3%',
            isPositive: true
        },
        {
            title: 'Influencers',
            value: stats.influencers,
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
            <div className="grid grid-cols-1 gap-8">
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
            </div>

            {/* Platform Health Section */}
            <div className="bg-gray-900 rounded-[48px] p-12 text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md mb-8">
                            <TrendingUp size={14} className="text-emerald-400" /> Platform Status
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-6">Your platform is operating smoothly</h2>
                        <p className="text-gray-400 font-medium leading-relaxed text-lg">All systems are running optimally with excellent performance metrics.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-all">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Users</p>
                            <h4 className="text-2xl font-black text-white tracking-tight">{stats.total}</h4>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-all">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Influencers</p>
                            <h4 className="text-2xl font-black text-white tracking-tight">{stats.influencers}</h4>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-all">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Brands</p>
                            <h4 className="text-2xl font-black text-white tracking-tight">{stats.brands}</h4>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-all">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Admins</p>
                            <h4 className="text-2xl font-black text-white tracking-tight">{stats.admins}</h4>
                        </div>
                    </div>
                </div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-600/10 blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
}
