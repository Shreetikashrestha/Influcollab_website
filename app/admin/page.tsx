"use client";

import {
    Users,
    Megaphone,
    Banknote,
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    CheckCircle,
    AlertTriangle,
    Flag
} from "lucide-react";
import DashboardStatCard from "@/components/DashboardStatCard";

export default function AdminOverview() {
    const stats = [
        { name: "Total Users", value: "12,458", icon: Users, trend: "+12.5% vs last period", trendType: "up" },
        { name: "Active Campaigns", value: "1,248", icon: Megaphone, trend: "+8.2% vs last period", trendType: "up" },
        { name: "Total Revenue", value: "$458,290", icon: Banknote, trend: "+23.1% vs last period", trendType: "up" },
        { name: "Platform Health", value: "98.5%", icon: Activity, trend: "-0.3% vs last period", trendType: "down" },
    ];

    const activities = [
        { type: "user", title: "New influencer registered", user: "Sarah Johnson", time: "5 min ago", icon: Users, color: "bg-green-50", iconColor: "text-green-500" },
        { type: "campaign", title: "Campaign launched", user: "Nike Brand", time: "12 min ago", icon: Megaphone, color: "bg-blue-50", iconColor: "text-blue-500" },
        { type: "payment", title: "Payment processed", user: "$1,250 to Mike Chen", time: "25 min ago", icon: Banknote, color: "bg-green-50", iconColor: "text-green-500" },
        { type: "report", title: "Content flagged for review", user: "Campaign #1245", time: "1 hour ago", icon: Flag, color: "bg-yellow-50", iconColor: "text-yellow-500" },
        { type: "verification", title: "Brand account verified", user: "Adidas Inc", time: "2 hours ago", icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-500" },
    ];

    const quickStats = [
        { label: "Pending Approvals", value: "24", icon: AlertTriangle, color: "text-purple-600", bgColor: "bg-purple-50" },
        { label: "Active Support Tickets", value: "12", icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50" },
        { label: "Completed Today", value: "156", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
        { label: "Flagged Content", value: "8", icon: Flag, color: "text-red-500", bgColor: "bg-red-50" },
    ];

    const userGrowthData = [40, 60, 50, 70, 65, 80, 75, 90, 85, 95, 100, 110];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    return (
        <div className="space-y-8 pb-12">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-7 rounded-[32px] border border-slate-50 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[14px] font-semibold text-slate-400">{stat.name}</span>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                        <h3 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-3">
                            {stat.value}
                        </h3>
                        <div className="flex items-center gap-1.5">
                            {stat.trendType === "up" ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-[11px] font-bold ${stat.trendType === "up" ? "text-green-500" : "text-red-500"}`}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-xl font-black text-slate-900">User Growth</h4>
                        <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-500 focus:ring-0">
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-3">
                        {userGrowthData.map((val, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-4">
                                <div
                                    className="w-full bg-auth-gradient rounded-t-xl"
                                    style={{ height: `${val}%`, minHeight: '10%' }}
                                ></div>
                                {idx % 2 === 0 && <span className="text-[10px] font-bold text-slate-300 uppercase">{months[idx / 2]}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-xl font-black text-slate-900">Revenue Trend</h4>
                        <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-500 focus:ring-0">
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-3">
                        {[50, 70, 60, 85, 75, 95, 80, 100, 90, 110, 105, 120].map((val, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-4">
                                <div
                                    className="w-full bg-green-400 rounded-t-xl opacity-80"
                                    style={{ height: `${val / 1.2}%`, minHeight: '10%' }}
                                ></div>
                                {idx % 2 === 0 && <span className="text-[10px] font-bold text-slate-300 uppercase">{months[idx / 2]}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Activity & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
                    <h4 className="text-xl font-black text-slate-900 mb-8">Recent Activity</h4>
                    <div className="space-y-8">
                        {activities.map((act, idx) => (
                            <div key={idx} className="flex gap-5 items-center">
                                <div className={`w-12 h-12 rounded-2xl ${act.color} flex items-center justify-center shrink-0`}>
                                    <act.icon className={`w-6 h-6 ${act.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-slate-900 leading-none mb-1">{act.title}</h5>
                                    <p className="text-sm font-medium text-slate-400">{act.user}</p>
                                </div>
                                <span className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">{act.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
                    <h4 className="text-xl font-black text-slate-900 mb-8">Quick Stats</h4>
                    <div className="space-y-4">
                        {quickStats.map((stat, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    <span className="text-sm font-bold text-slate-600">{stat.label}</span>
                                </div>
                                <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-6 bg-auth-gradient rounded-3xl text-white">
                        <h5 className="font-black text-lg mb-2">Pro Tip</h5>
                        <p className="text-sm font-medium opacity-90 leading-relaxed">
                            Review pending brand verifications to increase daily campaign volume.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
