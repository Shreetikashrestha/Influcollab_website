"use client";

import React from 'react';
import { Megaphone, Filter, Plus } from 'lucide-react';

export default function AdminCampaignsPage() {
    return (
        <div className="p-4 md:p-8 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Campaign Monitoring</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">Audit and manage platform-wide collaborations.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 text-xs font-black uppercase tracking-widest transition-all">
                        <Filter size={18} /> Filters
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        <Plus size={18} /> New Campaign
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-20 h-20 rounded-[28px] bg-purple-50 flex items-center justify-center text-purple-400 mx-auto mb-6">
                    <Megaphone size={40} />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Campaign Auditing</h3>
                <p className="text-gray-400 text-sm font-medium mt-1 max-w-sm mx-auto">This section is currently being integrated with the live marketing feed.</p>
            </div>
        </div>
    );
}
