"use client";

import {
    Users,
    Eye,
    Bookmark,
    Banknote,
    Calendar,
    MapPin,
    ChevronRight,
    Edit3
} from "lucide-react";
import Link from "next/link";

interface BrandCampaignItemProps {
    id: string;
    title: string;
    description: string;
    status: "Active" | "Draft" | "Completed";
    budget: string;
    deadline: string;
    location: string;
    category: string;
    applicants: number;
    views: number;
    saves: number;
}

export default function BrandCampaignItem({
    id,
    title,
    description,
    status,
    budget,
    deadline,
    location,
    category,
    applicants,
    views,
    saves
}: BrandCampaignItemProps) {
    return (
        <div className="bg-white rounded-4xl p-8 border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group mb-6">
            <div className="flex flex-col xl:flex-row gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                            {title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status === "Active"
                                ? "bg-green-50 text-green-500"
                                : "bg-slate-100 text-slate-400"
                            }`}>
                            {status}
                        </span>
                    </div>

                    <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2 max-w-2xl leading-relaxed">
                        {description}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[12px] font-bold text-slate-400">
                        <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-slate-300" />
                            <span>{budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-300" />
                            <span>Due: {deadline}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-300" />
                            <span>{location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            <span>{category}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 xl:border-l xl:border-slate-50 xl:pl-8">
                    <div className="grid grid-cols-3 gap-8 text-center min-w-60">
                        <div>
                            <p className="text-2xl font-black text-slate-900 mb-1">{applicants}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applicants</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 mb-1">{views}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Views</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 mb-1">{saves}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saves</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/campaigns/${id}`}
                            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-auth-gradient hover:text-white transition-all duration-300 shadow-sm"
                        >
                            <span>View Details</span>
                            <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                            href={`/campaigns/edit/${id}`}
                            className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all shadow-sm"
                        >
                            <Edit3 className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
