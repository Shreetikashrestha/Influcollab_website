"use client";

import {
    Search,
    Filter,
    Download,
    MoreVertical,
    Eye,
    Edit,
    UserPlus
} from "lucide-react";
import { useState } from "react";

const users = [
    { id: "1", name: "Sarah Johnson", email: "sarah@example.com", type: "Influencer", status: "Active", joined: "Jan 15, 2025", activity: "24 campaigns" },
    { id: "2", name: "Nike Inc", email: "marketing@nike.com", type: "Brand", status: "Active", joined: "Dec 20, 2024", activity: "12 campaigns" },
    { id: "3", name: "Mike Chen", email: "mike@example.com", type: "Influencer", status: "Active", joined: "Feb 1, 2025", activity: "8 campaigns" },
    { id: "4", name: "Adidas Brand", email: "team@adidas.com", type: "Brand", status: "Pending", joined: "Feb 2, 2025", activity: "0 campaigns" },
    { id: "5", name: "Emma Davis", email: "emma@example.com", type: "Influencer", status: "Suspended", joined: "Jan 5, 2025", activity: "15 campaigns" },
];

export default function AdminUsersPage() {
    const tabs = [
        { name: "All Users", count: "12,458" },
        { name: "Influencers", count: "8,234" },
        { name: "Brands", count: "4,224" },
        { name: "Pending Verification", count: "45" },
        { name: "Suspended", count: "12" },
    ];
    const [activeTab, setActiveTab] = useState("All Users");

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
                {/* Search and Filters Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <div className="relative w-full max-w-2xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search users by name, email, or ID..."
                            className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-5 text-base font-semibold text-slate-700 focus:ring-2 focus:ring-purple-100 placeholder:text-slate-300 transition-all"
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-100 px-6 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
                            <Filter className="w-5 h-5" />
                            <span>Filters</span>
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-auth-gradient text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <Download className="w-5 h-5" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Categories Tabs */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`px-6 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.name
                                    ? "bg-purple-100 text-purple-700 shadow-sm"
                                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                }`}
                        >
                            {tab.name} <span className="ml-1 opacity-60">({tab.count})</span>
                        </button>
                    ))}
                </div>

                {/* User Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-left">
                                <th className="px-6 pb-2 text-[12px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                <th className="px-6 pb-2 text-[12px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="px-6 pb-2 text-[12px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 pb-2 text-[12px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                                <th className="px-6 pb-2 text-[12px] font-black text-slate-400 uppercase tracking-widest">Activity</th>
                                <th className="px-6 pb-2 text-[12px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:scale-[1.005] transition-all duration-300">
                                    <td className="px-6 py-5 bg-slate-50/50 rounded-l-[24px] border-y border-l border-transparent group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-lg group-hover:shadow-slate-100/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-auth-gradient p-[1px]">
                                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-none mb-1">{user.name}</p>
                                                <p className="text-[12px] font-bold text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50/50 border-y border-transparent group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-lg group-hover:shadow-slate-100/50">
                                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${user.type === "Influencer"
                                                ? "bg-purple-100 text-purple-600"
                                                : "bg-pink-100 text-pink-600"
                                            }`}>
                                            {user.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50/50 border-y border-transparent group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-lg group-hover:shadow-slate-100/50">
                                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${user.status === "Active" ? "bg-green-100 text-green-600" :
                                                user.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                                                    "bg-red-100 text-red-600"
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50/50 border-y border-transparent group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-lg group-hover:shadow-slate-100/50 text-sm font-bold text-slate-500">
                                        {user.joined}
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50/50 border-y border-transparent group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-lg group-hover:shadow-slate-100/50 text-sm font-bold text-slate-500">
                                        {user.activity}
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50/50 rounded-r-[24px] border-y border-r border-transparent group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-lg group-hover:shadow-slate-100/50 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-purple-600 rounded-xl transition-all">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
