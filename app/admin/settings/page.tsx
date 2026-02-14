"use client";

import React from 'react';
import { Settings, Save, Shield, Globe, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="p-4 md:p-8 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Platform Configuration</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">Adjust global settings and security protocols.</p>
                </div>
                <button className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    <Save size={18} /> Save Changes
                </button>
            </header>

            <div className="max-w-4xl space-y-8">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                                <Shield size={22} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900 tracking-tight">Force MFA for Admins</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">High Security</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors">
                                <Bell size={22} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900 tracking-tight">System Notifications</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Active</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-amber-500 rounded-full relative cursor-pointer shadow-inner">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
