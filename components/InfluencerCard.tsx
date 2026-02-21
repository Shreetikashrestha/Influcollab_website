"use client";

import { UserCircle, MapPin, Star, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";

interface InfluencerCardProps {
    userId: string;
    fullName: string;
    username: string;
    profilePicture?: string;
    bio?: string;
    location?: {
        city?: string;
        country?: string;
    };
    niches?: string[];
    avgRating?: number;
    reviewCount?: number;
    isVerified?: boolean;
}

export default function InfluencerCard({
    userId,
    fullName,
    username,
    profilePicture,
    bio,
    location,
    niches,
    avgRating = 0,
    reviewCount = 0,
    isVerified = false
}: InfluencerCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border-2 border-white shadow-sm">
                        {profilePicture ? (
                            <img src={profilePicture} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-purple-50">
                                <UserCircle className="w-8 h-8 text-purple-400" />
                            </div>
                        )}
                    </div>
                    {isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate flex items-center gap-1 group-hover:text-purple-600 transition-colors">
                        {fullName}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium">@{username}</p>

                    <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-slate-700">{avgRating.toFixed(1)}</span>
                            <span className="text-[10px] text-slate-400">({reviewCount})</span>
                        </div>
                        {location?.city && (
                            <div className="flex items-center gap-1 text-slate-400">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-medium">{location.city}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {bio && (
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {bio}
                </p>
            )}

            <div className="flex flex-wrap gap-1.5 mt-auto">
                {niches && niches.length > 0 ? (
                    niches.slice(0, 3).map((niche, idx) => (
                        <span
                            key={idx}
                            className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-100"
                        >
                            {niche}
                        </span>
                    ))
                ) : (
                    <span className="text-slate-300 text-[10px] italic">No niche specified</span>
                )}
                {niches && niches.length > 3 && (
                    <span className="text-slate-400 text-[10px] font-bold py-1">+{niches.length - 3}</span>
                )}
            </div>

            <div className="flex gap-2 mt-5">
                <Link
                    href={`/messages?userId=${userId}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-auth-gradient hover:text-white text-slate-600 font-bold py-2.5 rounded-xl transition-all duration-300 text-xs shadow-sm border border-slate-100 hover:border-transparent"
                >
                    <MessageSquare size={14} /> Message
                </Link>
                <Link
                    href={`/influencers/${userId}`}
                    className="flex-1 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all duration-300 text-xs shadow-md active:scale-[0.98]"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}
