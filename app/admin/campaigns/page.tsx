"use client";

import {
    Megaphone,
    Activity,
    AlertCircle,
    TrendingUp,
    Filter,
    Download,
    Eye,
    MoreVertical
} from "lucide-react";

const campaigns = [
    { id: "#1000", name: "Summer Collection 2025", brand: "Nike", status: "Active", budget: "$25,000", applications: 156, progress: 68 },
    { id: "#1001", name: "Product Launch Event", brand: "Adidas", status: "Active", budget: "$18,500", applications: 89, progress: 45 },
    { id: "#1002", name: "Holiday Season Campaign", brand: "Puma", status: "Pending", budget: "$30,000", applications: 234, progress: 0 },
    { id: "#1003", name: "Fitness Challenge", brand: "Under Armour", status: "Active", budget: "$12,000", applications: 67, progress: 82 },
];

export default function AdminCampaignsPage() {
    const stats = [
        { label: "Total Campaigns", value: "1,248", change: "+8.2% from last month", icon: Megaphone, color: "text-purple-600", bgColor: "bg-purple-50" },
        { label: "Active", value: "856", change: "68.6% of total", icon: Activity, color: "text-green-600", bgColor: "bg-green-50" },
        { label: "Pending Review", value: "34", change: "Require attention", icon: AlertCircle, color: "text-yellow-600", bgColor: "bg-yellow-50" },
        { label: "Avg Success Rate", value: "87%", change: "+2.3% improvement", icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-50" },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-7 rounded-[32px] border border-slate-50 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[14px] font-semibold text-slate-400">{stat.label}</span>
                            <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <h3 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-3">
                            {stat.value}
                        </h3>
                        <p className={`text-[11px] font-bold ${stat.color}`}>{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* Campaign Table container */}
            <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                    <h4 className="text-2xl font-black text-slate-900">All Campaigns</h4>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3.5 bg-auth-gradient text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-100">
                            <Download className="w-4 h-4" />
                            <span>Export Report</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Campaign</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Brand</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Budget</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Applications</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Progress</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {campaigns.map((camp) => (
                                <tr key={camp.id} className="group">
                                    <td className="py-6 pr-4">
                                        <h5 className="font-bold text-slate-900 mb-1">{camp.name}</h5>
                                        <span className="text-[11px] font-bold text-slate-400 leading-none">ID: {camp.id}</span>
                                    </td>
                                    <td className="py-6 text-center text-sm font-bold text-slate-500">{camp.brand}</td>
                                    <td className="py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${camp.status === "Active" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                                            }`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="py-6 text-center text-sm font-black text-slate-900">{camp.budget}</td>
                                    <td className="py-6 text-center text-sm font-bold text-slate-500">{camp.applications}</td>
                                    <td className="py-6 px-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-24 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                                <div
                                                    className={`h-full ${camp.progress > 0 ? 'bg-auth-gradient' : 'bg-slate-200'} rounded-full`}
                                                    style={{ width: `${camp.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[11px] font-black text-slate-900 w-8">{camp.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2.5 text-slate-400 hover:text-purple-600 rounded-xl hover:bg-purple-50 transition-all">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
                                                <MoreVertical className="w-5 h-5" />
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
