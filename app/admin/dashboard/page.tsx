"use client";

import React, { useState } from 'react';
import {
    Users,
    Megaphone,
    CircleDollarSign,
    Bell,
    Plus,
    X,
    TrendingUp,
    Activity
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

// --- Mock Data ---
const STATS = [
    { label: 'Total Users', value: '12,842', grow: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Campaigns', value: '452', grow: '+5%', icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Revenue', value: '$84,200', grow: '+18%', icon: CircleDollarSign, color: 'text-green-600', bg: 'bg-green-50' },
];

const CHART_DATA = [
    { name: 'Jan', val: 400 }, { name: 'Feb', val: 700 }, { name: 'Mar', val: 1200 },
    { name: 'Apr', val: 1500 }, { name: 'May', val: 1800 }, { name: 'Jun', val: 2400 },
];

export default function AdminDashboard() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="p-4 md:p-8 min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Overview</h1>
                    <p className="text-gray-500 text-sm font-medium">Real-time performance and user metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        <Plus size={18} /> New Campaign
                    </button>
                    <div className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="xl:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-gray-900 text-lg tracking-tight">User Growth Analytics</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">First half of 2026</p>
                        </div>
                        <select className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-none rounded-xl px-4 py-2 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last year</option>
                        </select>
                    </div>
                    <div className="h-[340px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CHART_DATA}>
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
                    </div>
                </div>

                {/* Quick Activity */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <h3 className="font-black text-gray-900 text-lg tracking-tight mb-8">System Health</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900">API Performance</p>
                                <p className="text-xs font-bold text-emerald-500">99.9% Uptime</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900">Active Sessions</p>
                                <p className="text-xs font-bold text-blue-500">2,480 Concurrent</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* "New Campaign" Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center p-8 border-b border-gray-50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create New Campaign</h2>
                                <p className="text-sm font-bold text-gray-400 mt-1">Define platform-wide marketing initiatives</p>
                            </div>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Campaign Title</label>
                                <input
                                    type="text"
                                    placeholder="Summer 2026 Collection Launch"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-bold text-gray-900"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Budget Allocation ($)</label>
                                    <input
                                        type="number"
                                        placeholder="5000"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Preferred Platform</label>
                                    <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-bold text-blue-600">
                                        <option>Instagram</option>
                                        <option>TikTok</option>
                                        <option>YouTube</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-base shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all mt-4"
                            >
                                Finalize & Distribute
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}