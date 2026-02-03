"use client";

import { Bell, Edit, Mail, MapPin, Calendar, CheckCircle, Instagram, Facebook, Youtube, TrendingUp, Heart, Eye, Banknote } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function InfluencerProfilePage() {
    const { user } = useAuth();

    const stats = [
        { label: "Total Followers", value: "25.5K", trend: "+12% this month", icon: TrendingUp, color: "text-green-500", bgColor: "bg-green-50" },
        { label: "Engagement Rate", value: "4.8%", trend: "Above average", icon: Heart, color: "text-purple-500", bgColor: "bg-purple-50" },
        { label: "Total Reach", value: "180K", trend: "Last 30 days", icon: Eye, color: "text-blue-500", bgColor: "bg-blue-50" },
        { label: "Earnings", value: "NPR 450K", trend: "Total earned", icon: Banknote, color: "text-green-600", bgColor: "bg-green-50" },
    ];

    return (
        <div className="bg-[#fcfcfd] min-h-screen px-8 py-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-[32px] font-black text-slate-900 tracking-tight">Profile</h1>
                <div className="flex items-center gap-4">
                    <button className="relative p-3.5 bg-white shadow-sm rounded-2xl text-slate-400 hover:text-purple-600 hover:shadow-md transition-all border border-slate-50">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 bg-white p-2 pr-4 shadow-sm rounded-full hover:shadow-md transition-all cursor-pointer border border-slate-50">
                        <div className="w-9 h-9 rounded-full bg-auth-gradient p-[1px]">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-white">
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{user?.fullName?.split(' ')[0] || 'User'}</span>
                    </div>
                </div>
            </header>

            {/* Profile Header Card */}
            <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm mb-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-10 items-start md:items-center relative z-10">
                    <div className="relative group">
                        <div className="w-44 h-44 rounded-full bg-auth-gradient p-[4px]">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-slate-100 shadow-lg p-2 rounded-xl text-slate-600 hover:text-purple-600 transition-all flex items-center gap-2 px-4 whitespace-nowrap">
                            <Edit className="w-4 h-4" />
                            <span className="text-xs font-bold">Edit Photo</span>
                        </button>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-[40px] font-black text-slate-900 tracking-tight leading-none mb-2">
                                    {user?.fullName || "Priya Sharma"}
                                </h2>
                                <p className="text-lg font-bold text-slate-400">
                                    Fashion & Lifestyle Influencer
                                </p>
                            </div>
                            <button className="bg-auth-gradient text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <Edit className="w-5 h-5" />
                                <span>Edit Profile</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 pb-6 border-b border-slate-50">
                            <div className="flex items-center gap-3 text-slate-500 font-medium">
                                <Mail className="w-5 h-5 text-slate-300" />
                                <span className="text-sm">{user?.email || "priya.sharma@email.com"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 font-medium">
                                <MapPin className="w-5 h-5 text-slate-300" />
                                <span className="text-sm">Kathmandu, Nepal</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 font-medium">
                                <Calendar className="w-5 h-5 text-slate-300" />
                                <span className="text-sm">Joined January 2024</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 font-medium">
                                <CheckCircle className="w-5 h-5 text-slate-300" />
                                <span className="text-sm">6 Campaigns Completed</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-xl text-slate-700 font-bold hover:bg-white transition-all">
                                <Instagram className="w-4 h-4 text-pink-500" />
                                <span className="text-sm">@priya.sharma</span>
                            </button>
                            <button className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-xl text-slate-700 font-bold hover:bg-white transition-all">
                                <Facebook className="w-4 h-4 text-blue-600" />
                                <span className="text-sm">Priya Sharma</span>
                            </button>
                            <button className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-xl text-slate-700 font-bold hover:bg-white transition-all">
                                <Youtube className="w-4 h-4 text-red-600" />
                                <span className="text-sm">Priya's Vlogs</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm flex flex-col gap-4">
                        <span className="text-[15px] font-bold text-slate-400">{stat.label}</span>
                        <div className="flex items-end justify-between">
                            <h3 className="text-[32px] font-black text-slate-900 leading-none">{stat.value}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`${stat.bgColor} p-1.5 rounded-lg`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <span className={`text-[13px] font-bold ${stat.color}`}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-50 w-fit p-1.5 rounded-2xl border border-slate-100">
                {["Overview", "Achievements", "Portfolio"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${tab === "Overview"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                {/* Profile Completion */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
                    <h4 className="text-xl font-black text-slate-900 mb-2">Profile Completion</h4>
                    <p className="text-sm font-bold text-slate-400 mb-8">Complete your profile to attract more brands</p>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-black text-slate-700">Overall Progress</span>
                            <span className="text-sm font-black text-purple-600">85%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <div className="h-full bg-auth-gradient rounded-full" style={{ width: "85%" }}></div>
                        </div>
                    </div>

                    <ul className="space-y-4">
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            </div>
                            <span className="text-sm font-bold text-slate-600">Basic Information</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-400">
                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-200"></div>
                            </div>
                            <span className="text-sm font-bold">Social Media Links</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            </div>
                            <span className="text-sm font-bold text-slate-600">Campaign History</span>
                        </li>
                    </ul>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
                    <h4 className="text-xl font-black text-slate-900 mb-2">Recent Activity</h4>
                    <p className="text-sm font-bold text-slate-400 mb-8">Your latest collaborations and interactions</p>

                    <div className="space-y-8">
                        <div className="flex gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                                <Banknote className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-900 mb-1">Campaign Completed</h5>
                                <p className="text-sm text-slate-500 font-medium mb-1">Vajra Style Nepal - Summer Collection</p>
                                <span className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">2 days ago</span>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-900 mb-1">New Follower Milestone</h5>
                                <p className="text-sm text-slate-500 font-medium mb-1">Reached 25,000 followers on Instagram!</p>
                                <span className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">5 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
