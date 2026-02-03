"use client";

import {
    Banknote,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    TrendingUp
} from "lucide-react";

const transactions = [
    { id: "TXN001234", from: "Nike Inc", to: "Sarah Johnson", amount: "$1,250", date: "Feb 1, 2025", status: "Completed" },
    { id: "TXN001235", from: "Adidas Brand", to: "Mike Chen", amount: "$2,100", date: "Feb 1, 2025", status: "Pending" },
    { id: "TXN001236", from: "Puma", to: "Emma Davis", amount: "$850", date: "Jan 31, 2025", status: "Completed" },
    { id: "TXN001237", from: "Under Armour", to: "John Doe", amount: "$1,500", date: "Jan 31, 2025", status: "Failed" },
];

export default function AdminTransactionsPage() {
    const stats = [
        { label: "Total Volume", value: "$458,290", sub: "+23.1% from last month", icon: Banknote, color: "text-green-600", bgColor: "bg-green-50" },
        { label: "Completed", value: "2,458", sub: "This month", icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-50" },
        { label: "Pending", value: "124", sub: "Awaiting processing", icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-50" },
        { label: "Failed", value: "8", sub: "Requires attention", icon: XCircle, color: "text-red-500", bgColor: "bg-red-50" },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-7 rounded-[32px] border border-slate-50 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[14px] font-semibold text-slate-400">{stat.label}</span>
                            <div className={`${stat.bgColor} p-2.5 rounded-xl`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <h3 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-3">
                            {stat.value}
                        </h3>
                        <p className={`text-[11px] font-bold ${stat.color}`}>{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm">
                <h4 className="text-2xl font-black text-slate-900 mb-10">Recent Transactions</h4>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">From</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">To</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((txn, idx) => (
                                <tr key={idx} className="group">
                                    <td className="py-6 font-bold text-slate-600 text-sm">{txn.id}</td>
                                    <td className="py-6 font-bold text-slate-900 text-sm">{txn.from}</td>
                                    <td className="py-6 font-bold text-slate-900 text-sm">{txn.to}</td>
                                    <td className="py-6 font-black text-slate-900 text-sm">{txn.amount}</td>
                                    <td className="py-6 font-bold text-slate-400 text-sm">{txn.date}</td>
                                    <td className="py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${txn.status === "Completed" ? "bg-green-100 text-green-600" :
                                                txn.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                                                    "bg-red-100 text-red-600"
                                            }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="py-6 text-right">
                                        <button className="p-2.5 text-slate-400 hover:text-purple-600 rounded-xl hover:bg-purple-50 transition-all">
                                            <Eye className="w-5 h-5" />
                                        </button>
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
