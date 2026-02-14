"use client";

import React from 'react';
import { CircleDollarSign, Download } from 'lucide-react';

export default function AdminPaymentsPage() {
    return (
        <div className="p-4 md:p-8 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Financial Ledger</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">Track payouts and platform revenue streams.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                    <Download size={18} /> Export CSV
                </button>
            </header>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-20 h-20 rounded-[28px] bg-emerald-50 flex items-center justify-center text-emerald-400 mx-auto mb-6">
                    <CircleDollarSign size={40} />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Payment Processing</h3>
                <p className="text-gray-400 text-sm font-medium mt-1 max-w-sm mx-auto">The transaction history is being synchronized with the payment gateway.</p>
            </div>
        </div>
    );
}
