"use client";

import React, { useState, useEffect } from 'react';
import { CircleDollarSign, Download, ArrowUpRight, ArrowDownRight, Activity, TrendingUp, X } from 'lucide-react';
import { fetchTransactions, fetchTransactionStats } from '@/lib/api/payment';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function AdminPaymentsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalVolume: 0,
        transactionCount: 0
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch transactions
            const txData: any = await fetchTransactions();
            if (txData.success) {
                setTransactions(txData.transactions || []);
            } else {
                setError(txData.message || 'Failed to load transactions');
                setTransactions([]);
            }

            // Fetch stats
            const statsData: any = await fetchTransactionStats();
            if (statsData.success) {
                setStats(statsData.stats || { totalRevenue: 0, totalVolume: 0, transactionCount: 0 });
            }
        } catch (error: any) {
            console.error('Failed to load payment data:', error);
            setError(error.message || 'Failed to load payment data');
            toast.error('Failed to load payment data');
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (transactions.length === 0) {
            toast.info('No transactions to export');
            return;
        }

        const headers = ['Date', 'Brand', 'Campaign', 'Amount', 'Platform Fee', 'Net Amount', 'Status'];
        const rows = transactions.map(tx => [
            format(new Date(tx.createdAt), 'yyyy-MM-dd HH:mm:ss'),
            tx.brandId?.fullName || 'N/A',
            tx.campaignId?.title || 'N/A',
            tx.amount,
            tx.platformFee,
            tx.netAmount,
            tx.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Transactions exported successfully');
    };

    return (
        <div className="p-4 md:p-8 min-h-screen space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Financial Ledger</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">Track payouts and platform revenue streams.</p>
                </div>
                <button 
                    onClick={exportToCSV}
                    disabled={transactions.length === 0}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download size={18} /> Export CSV
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-7 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
                            <CircleDollarSign size={26} />
                        </div>
                        <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-lg text-[11px] font-black italic">
                            <TrendingUp size={12} />
                            Revenue
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Platform Revenue</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">
                        {loading ? '...' : `NPR ${stats.totalRevenue.toLocaleString()}`}
                    </h3>
                </div>

                <div className="bg-white p-7 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
                            <Activity size={26} />
                        </div>
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[11px] font-black italic">
                            <TrendingUp size={12} />
                            Volume
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Volume</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">
                        {loading ? '...' : `NPR ${stats.totalVolume.toLocaleString()}`}
                    </h3>
                </div>

                <div className="bg-white p-7 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600">
                            <ArrowUpRight size={26} />
                        </div>
                        <div className="flex items-center gap-1 bg-purple-50 text-purple-600 px-2.5 py-1 rounded-lg text-[11px] font-black italic">
                            Count
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Transactions</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">
                        {loading ? '...' : stats.transactionCount.toLocaleString()}
                    </h3>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="text-white" size={14} />
                        </div>
                        <div>
                            <h3 className="text-red-800 font-bold text-sm mb-1">Failed to Load Transactions</h3>
                            <p className="text-red-700 text-xs">{error}</p>
                            <button
                                onClick={loadData}
                                className="mt-3 text-xs font-bold text-red-600 hover:text-red-700 underline"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            ) : transactions.length === 0 ? (
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-12 text-center">
                    <div className="w-20 h-20 rounded-[28px] bg-emerald-50 flex items-center justify-center text-emerald-400 mx-auto mb-6">
                        <CircleDollarSign size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">No Transactions Yet</h3>
                    <p className="text-gray-400 text-sm font-medium mt-1 max-w-sm mx-auto">Once brands fund campaigns, they will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Brand</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Campaign</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Fee (15%)</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Net</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                            {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {format(new Date(tx.createdAt), 'HH:mm')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold">
                                                    {tx.brandId?.fullName?.[0] || 'B'}
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{tx.brandId?.fullName || 'Deleted Brand'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-700 max-w-[200px] truncate">
                                            {tx.campaignId?.title || 'Unknown Campaign'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-gray-900">
                                                NPR {tx.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-emerald-600">
                                                +NPR {tx.platformFee.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-700">
                                                NPR {tx.netAmount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tx.status === 'funded' || tx.status === 'released' ? 'bg-emerald-50 text-emerald-600' :
                                                tx.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-gray-50 text-gray-600'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
