"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardCta() {
    return (
        <div className="relative overflow-hidden bg-auth-gradient rounded-[40px] p-10 mb-12 shadow-2xl shadow-purple-200 group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                        Ready to launch a new campaign?
                    </h2>
                    <p className="text-purple-50 font-medium max-w-md leading-relaxed">
                        Create targeted campaigns and connect with the perfect influencers for your brand.
                    </p>
                </div>
                <Link
                    href="/campaigns/create"
                    className="flex items-center gap-3 bg-white text-purple-600 px-8 py-5 rounded-3xl font-black shadow-xl hover:scale-105 transition-all active:scale-95 group-hover:shadow-white/20"
                >
                    <Plus className="w-6 h-6" />
                    <span>New Campaign</span>
                </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute bottom-[-100px] left-[10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
    );
}
