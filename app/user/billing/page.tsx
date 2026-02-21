"use client";

import React, { useEffect, useState } from 'react';
import { DollarSign, Download, Calendar, ArrowUpRight, ArrowDownLeft, Wallet, AlertCircle, Clock, Banknote, Landmark } from 'lucide-react';
import { fetchMyTransactions, fetchWalletBalance, requestPayout } from '@/lib/api/payment';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

export default function InfluencerBillingPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [wallet, setWallet] = useState({ totalEarnings: 0, totalWithdrawals: 0, currentBalance: 0, pendingPayouts: 0 });
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);

    // Payout Form State
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutMethod, setPayoutMethod] = useState('bank');

    const loadData = async () => {
        try {
            setLoading(true);
            const [txRes, walletRes]: [any, any] = await Promise.all([
                fetchMyTransactions(),
                fetchWalletBalance()
            ]);

            if (txRes.success) setTransactions(txRes.transactions);
            if (walletRes.success) setWallet(walletRes.data);
        } catch (error) {
            console.error("Failed to load billing data", error);
            toast.error("Failed to load wallet data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRequestPayout = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(payoutAmount);

        if (!amount || amount <= 0) {
            toast.error("Please enter a valid amount greater than 0");
            return;
        }

        if (amount < 100) {
            toast.error("Minimum withdrawal amount is NPR 100");
            return;
        }

        if (amount > wallet.currentBalance) {
            toast.error("Insufficient balance");
            return;
        }

        try {
            setRequesting(true);
            const res: any = await requestPayout({ amount, method: payoutMethod });
            if (res.success) {
                toast.success("Payout request submitted successfully!");
                setShowPayoutModal(false);
                setPayoutAmount('');
                loadData(); // Refresh data
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to request payout");
        } finally {
            setRequesting(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Wallet & Earnings</h1>
                    <p className="text-gray-500 mt-2 font-medium">Track your income and withdraw funds</p>
                </div>
                <button
                    onClick={() => setShowPayoutModal(true)}
                    className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                >
                    <Banknote className="w-5 h-5 mr-2" /> Withdraw Funds
                </button>
            </div>

            {/* Wallet Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Wallet className="w-8 h-8 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold border border-white/10 backdrop-blur-md">
                                Available for Withdrawal
                            </span>
                        </div>
                        <p className="text-gray-200 font-medium mb-1">Current Balance</p>
                        <h2 className="text-5xl font-black mb-4 tracking-tight">NPR {wallet.currentBalance.toLocaleString()}</h2>
                        {wallet.pendingPayouts > 0 && (
                            <div className="flex items-center text-sm font-medium text-blue-100 bg-blue-800/30 px-3 py-1.5 rounded-lg w-fit">
                                <Clock className="w-4 h-4 mr-2" />
                                NPR {wallet.pendingPayouts.toLocaleString()} pending processing
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-600">
                        <ArrowDownLeft className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Earnings</p>
                    <h3 className="text-2xl font-black text-gray-900">NPR {wallet.totalEarnings.toLocaleString()}</h3>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-orange-600">
                        <ArrowUpRight className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Withdrawn</p>
                    <h3 className="text-2xl font-black text-gray-900">NPR {wallet.totalWithdrawals.toLocaleString()}</h3>
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
                                            <p className="text-sm font-bold text-gray-900">{t.description || (t.type === 'payout' ? 'Payout Request' : 'Campaign earnings')}</p>
                                            {t.campaignId && <p className="text-xs text-gray-500 font-medium mt-0.5">{t.campaignId.title}</p>}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`text-sm font-black ${t.type === 'payout' ? 'text-gray-900' : 'text-green-600'}`}>
                                                {t.type === 'payout' ? '-' : '+'} NPR {(t.type === 'payment' ? t.netAmount : t.amount).toLocaleString()}
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
                                                <AlertCircle className="w-8 h-8 text-gray-300" />
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

            {/* Payout Modal */}
            {showPayoutModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Withdraw Funds</h2>
                        <p className="text-gray-500 mb-6">Enter amount to withdraw to your preferred method.</p>

                        <form onSubmit={handleRequestPayout} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1">Amount (NPR)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">NPR</span>
                                    <input
                                        type="number"
                                        value={payoutAmount}
                                        onChange={(e) => setPayoutAmount(e.target.value)}
                                        className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-bold"
                                        placeholder="100.00"
                                        min="1"
                                        step="0.01"
                                        max={wallet.currentBalance}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2 font-medium">Minimum: NPR 100 | Max available: NPR {wallet.currentBalance.toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1">Payment Method</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPayoutMethod('bank')}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${payoutMethod === 'bank' ? 'bg-blue-50 border-blue-200 text-blue-600 ring-2 ring-blue-500/20' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                    >
                                        <Landmark className="w-6 h-6 mb-1" />
                                        <span className="text-xs font-bold">Bank Transfer</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPayoutMethod('esewa')}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${payoutMethod === 'esewa' ? 'bg-green-50 border-green-200 text-green-600 ring-2 ring-green-500/20' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                    >
                                        <Wallet className="w-6 h-6 mb-1" />
                                        <span className="text-xs font-bold">eSewa / Khalti</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPayoutModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={requesting}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {requesting ? 'Processing...' : 'Confirm Withdraw'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
