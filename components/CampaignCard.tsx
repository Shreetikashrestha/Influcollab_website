"use client";

import { Heart, Bookmark, Users, MapPin, Calendar, Banknote, Eye } from "lucide-react";
import Link from "next/link";

interface CampaignCardProps {
    id: string;
    title: string;
    brand: string;
    category: string;
    reward: string;
    deadline: string;
    location: string;
    applicants: number;
    description?: string;
    image?: string;
}

export default function CampaignCard({
    id,
    title,
    brand,
    category,
    reward,
    deadline,
    location,
    applicants,
    description,
    image
}: CampaignCardProps) {
    return (
        <div className="bg-white rounded-4xl p-6 border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
                <span className="px-4 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                    {category}
                </span>
                <div className="flex gap-2">
                    <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                        <Bookmark className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {title}
                </h3>
                <p className="text-sm font-bold text-slate-500">
                    {brand}
                </p>
            </div>

            {description && (
                <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed font-medium">
                    {description}
                </p>
            )}

            <div className="space-y-4 mb-8">
                <div className="flex items-center text-[13px] font-bold">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                        <Banknote className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-green-600">{reward}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-[12px] font-bold text-slate-400">
                        <Calendar className="w-4 h-4 mr-2 text-slate-300" />
                        <span>Due: {deadline}</span>
                    </div>
                    <div className="flex items-center text-[12px] font-bold text-slate-400">
                        <MapPin className="w-4 h-4 mr-2 text-slate-300" />
                        <span>{location}</span>
                    </div>
                </div>

                <div className="flex items-center text-[12px] font-bold text-slate-400">
                    <Users className="w-4 h-4 mr-2 text-slate-300" />
                    <span>{applicants} applicants</span>
                </div>
            </div>

            <Link
                href={`/campaigns/${id}`}
                className="flex items-center justify-center gap-2 w-full bg-auth-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                <Eye className="w-5 h-5" />
                <span>View Details</span>
            </Link>
        </div>
    );
}
