"use client";

import React, { useEffect, useState } from 'react';
import { CreditCard, DollarSign, Download, Calendar, ArrowUpRight, ArrowDownLeft, Wallet, ShieldCheck, Plus } from 'lucide-react';
import { fetchMyTransactions } from '@/lib/api/payment';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

export default function BrandBillingPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res: any = await fetchMyTransactions();
                if (res.success) {
                    setTransactions(res.transactions);
                }
            } catch (error) {
                console.error("Failed to fetch transactions", error);
                toast.error("Failed to load billing history");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const totalSpent = transactions
        .filter(t => t.type === 'payment' && t.status !== 'failed')
        .reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Billing & Payments</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your payment methods and view transaction history</p>
                </div>
                <button className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                    <Plus className="w-5 h-5 mr-2" /> Add Payment Method
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Spent Card */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Spent</p>
                        <h3 className="text-3xl font-black text-gray-900">NPR {totalSpent.toLocaleString()}</h3>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl shadow-gray-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold border border-white/10">Default</span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1">Visa ending in 4242</p>
                            <p className="text-white/50 text-xs">Expires 12/28</p>
                        </div>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="bg-green-50 rounded-3xl p-6 border border-green-100 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-green-600">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Secure Payments</h3>
                    <p className="text-sm text-gray-500 font-medium">All transactions are encrypted and secured by Stripe.</p>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-900">Transaction History</h3>
                    <button className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                        <Download className="w-4 h-4 mr-2" /> Download Statement
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-wider">Transaction ID</th>
                                <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-wider">Description</th>
                                <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">Loading transactions...</td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((t) => (
                                    <tr key={t._id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6 text-sm font-bold text-gray-500 font-mono">#{t._id.slice(-8).toUpperCase()}</td>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {format(new Date(t.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm font-bold text-gray-900">{t.description || 'Payment'}</p>
                                            {t.campaignId && <p className="text-xs text-gray-500 font-medium mt-0.5">{t.campaignId.title}</p>}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`text-sm font-black ${t.type === 'refund' ? 'text-green-600' : 'text-gray-900'}`}>
                                                {t.type === 'refund' ? '+' : '-'} NPR {t.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${t.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                t.status === 'failed' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <Wallet className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-500 font-medium">No transactions found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
