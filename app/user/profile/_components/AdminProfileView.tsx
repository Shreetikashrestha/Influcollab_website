"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Users, Briefcase, FileText, AlertTriangle, Settings, BarChart3, Clock } from 'lucide-react';
import { getAdminStats } from '@/lib/api/admin';

export const AdminProfileView = ({ user, onEdit }: { user: any, onEdit: () => void }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeCampaigns: 0,
        pendingReports: 0,
        totalTransactions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await getAdminStats();
                if ((res as any).success) {
                    setStats((res as any).data);
                }
            } catch (error) {
                console.error('Failed to load admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const adminStats = [
        { label: 'Total Users', value: loading ? '...' : stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600' },
        { label: 'Active Campaigns', value: loading ? '...' : stats.activeCampaigns, icon: Briefcase, color: 'text-green-600' },
        { label: 'Pending Reports', value: loading ? '...' : stats.pendingReports, icon: AlertTriangle, color: 'text-red-500' },
        { label: 'Transactions', value: loading ? '...' : `$${(stats.totalTransactions / 1000).toFixed(1)}K`, icon: BarChart3, color: 'text-purple-600' },
    ];

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-48 -mt-48"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                        <Shield className="w-16 h-16 text-blue-400" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-black mb-2">{user.fullName}</h1>
                        <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-6 flex items-center justify-center md:justify-start">
                            <Shield className="w-3 h-3 mr-2" /> System Administrator
                        </p>
                        <div className="flex items-center justify-center md:justify-start space-x-4">
                            <button
                                onClick={onEdit}
                                className="px-8 py-3 bg-white text-gray-900 font-black rounded-2xl hover:bg-gray-100 transition-all shadow-xl"
                            >
                                Admin Settings
                            </button>
                            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all">
                                <Settings className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-end text-right">
                        <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 text-[10px] font-black tracking-widest mb-4">
                            SYSTEM STATUS: OPERATIONAL
                        </div>
                        <p className="text-gray-400 text-xs flex items-center"><Clock className="w-3 h-3 mr-2" /> Last login: Just now</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {adminStats.map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-gray-50 rounded-xl">
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</h4>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Admin Actions</h3>
                    <div className="space-y-4">
                        {[
                            { action: 'Updated subscription plans', time: '2 hours ago' },
                            { action: 'Approved 12 influencers', time: '5 hours ago' },
                            { action: 'Modified platform fee', time: 'Yesterday' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center p-4 bg-gray-50 rounded-2xl border border-transparent">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-4"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">{item.action}</p>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Security & Logs</h3>
                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700">
                            <span>View Access Logs</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700">
                            <span>Backup System Data</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700">
                            <span>Global API Keys</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
