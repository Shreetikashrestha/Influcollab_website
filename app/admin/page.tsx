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
    ArrowDownRight
} from 'lucide-react';
import { getAllUsers } from '@/lib/api/admin';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total: 0,
        influencers: 0,
        brands: 0,
        admins: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAllUsers({ limit: 1000 }) as any;
                if (res.success) {
                    const users = res.users;
                    setStats({
                        total: res.total,
                        influencers: users.filter((u: any) => u.isInfluencer).length,
                        brands: users.filter((u: any) => !u.isInfluencer && u.role !== 'admin').length,
                        admins: users.filter((u: any) => u.role === 'admin').length
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
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
            title: 'Active Influencers',
            value: stats.influencers,
            icon: Activity,
            color: 'purple',
            trend: '+5.2%',
            isPositive: true
        },
        {
            title: 'Partner Brands',
            value: stats.brands,
            icon: UserCheck,
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

            {/* Extra Feature: Engagement Overview */}
            <div className="bg-gray-900 rounded-[48px] p-12 text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md mb-8">
                            <TrendingUp size={14} className="text-emerald-400" /> System Growth
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-6">User acquisition is up 24% this month</h2>
                        <p className="text-gray-400 font-medium leading-relaxed text-lg">Your marketing campaigns are driving significant traffic to the influencer onboarding flow. Consider increasing server capacity for the upcoming weekend rush.</p>
                    </div>
                    <div className="w-full md:w-[400px] h-[250px] bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl p-10 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Peak Activity</p>
                            <Shield className="text-blue-500" size={20} />
                        </div>
                        <div className="space-y-4">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[80%] bg-blue-500 rounded-full"></div>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[45%] bg-purple-500 rounded-full"></div>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[65%] bg-emerald-500 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Resource Allocation: Optimized</p>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
}
