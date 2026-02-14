import React from "react";
import { Megaphone, Users, Eye, Bookmark, Heart, Banknote, LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
    title: string;
    value: string | number;
    icon: string | LucideIcon;
    trend?: string;
}

const iconMap: Record<string, React.ReactNode> = {
    megaphone: <Megaphone className="w-5 h-5 text-slate-500" />,
    users: <Users className="w-5 h-5 text-slate-500" />,
    eye: <Eye className="w-5 h-5 text-slate-500" />,
    bookmark: <Bookmark className="w-5 h-5 text-slate-500" />,
    heart: <Heart className="w-5 h-5 text-slate-500" />,
    banknote: <Banknote className="w-5 h-5 text-slate-500" />,
};

export default function DashboardStatCard({ title, value, icon, trend }: DashboardStatCardProps) {
    const renderIcon = () => {
        if (typeof icon === 'string') {
            return iconMap[icon] || <Megaphone className="w-5 h-5 text-slate-500" />;
        }
        const IconComponent = icon;
        return <IconComponent className="w-5 h-5 text-slate-500" />;
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {title}
                </p>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    {renderIcon()}
                </div>
            </div>
            <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {value}
                </h3>
                {trend && (
                    <span className="text-[11px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}
