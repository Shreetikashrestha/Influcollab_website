"use client";

import { Star, MapPin, Users, Banknote } from "lucide-react";

interface BrandCardProps {
    name: string;
    category: string;
    description: string;
    rating: number;
    activeCampaigns: number;
    budgetRange: string;
    location: string;
    logo?: string;
}

export default function BrandCard({
    name,
    category,
    description,
    rating,
    activeCampaigns,
    budgetRange,
    location,
    logo
}: BrandCardProps) {
    return (
        <div className="bg-white rounded-4xl p-8 border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center p-3">
                    {logo ? (
                        <img src={logo} alt={name} className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-full h-full rounded-lg bg-blue-100 flex items-center justify-center">
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">{name}</h3>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-400">{category}</span>
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-slate-700">{rating}</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed line-clamp-2">
                {description}
            </p>

            <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-[13px] font-bold">
                    <span className="text-slate-400">Active Campaigns</span>
                    <span className="text-slate-900">{activeCampaigns}</span>
                </div>
                <div className="flex items-center justify-between text-[13px] font-bold">
                    <span className="text-slate-400">Budget Range</span>
                    <span className="text-green-600 font-black">{budgetRange}</span>
                </div>
                <div className="flex items-center text-[13px] font-bold text-slate-400">
                    <MapPin className="w-4 h-4 mr-2 text-slate-300" />
                    <span>{location}</span>
                </div>
            </div>

            <button className="flex items-center justify-center gap-2 w-full bg-auth-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Users className="w-5 h-5" />
                <span>Connect</span>
            </button>
        </div>
    );
}
