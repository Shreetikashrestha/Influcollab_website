"use client";

import { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
}

export default function DashboardStatCard({ title, value, icon, trend }: DashboardStatCardProps) {
    return (
        <div className="bg-white p-7 rounded-[32px] border border-slate-50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col gap-3">
                <p className="text-[14px] font-semibold text-slate-400">
                    {title}
                </p>
                <div className="flex items-center justify-between">
                    <h3 className="text-[32px] font-black text-slate-900 tracking-tight">
                        {value}
                    </h3>
                </div>
                {trend && (
                    <span className="text-[11px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg w-fit">
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}
