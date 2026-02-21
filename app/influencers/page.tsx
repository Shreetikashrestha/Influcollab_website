"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter, SlidersHorizontal, Users, ShieldCheck, Star } from "lucide-react";
import { fetchInfluencers } from "@/lib/api/influencer";
import InfluencerCard from "@/components/InfluencerCard";
import { debounce } from "lodash";

export default function FindInfluencersPage() {
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNiche, setSelectedNiche] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Categories and Niches (In a real app, these could come from an API)
    const categories = ["Fashion", "Technology", "Lifestyle", "Beauty", "Food", "Travel", "Fitness"];
    const niches = ["Micro-influencer", "Macro-influencer", "Content Creator", "Blogger", "Vlogger", "Model"];

    const getInfluencers = async () => {
        try {
            setLoading(true);
            const response = await fetchInfluencers({
                search: searchQuery,
                niche: selectedNiche,
                category: selectedCategory
            }) as any;
            if (response.success) {
                setInfluencers(response.data);
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch influencers");
        } finally {
            setLoading(false);
        }
    };

    // Debounced fetch for real-time search
    const debouncedFetch = useCallback(
        debounce(() => {
            getInfluencers();
        }, 500),
        [searchQuery, selectedNiche, selectedCategory]
    );

    useEffect(() => {
        debouncedFetch();
        return debouncedFetch.cancel;
    }, [searchQuery, selectedNiche, selectedCategory, debouncedFetch]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Find Influencers</h1>
                <p className="text-slate-500 font-medium">Discover and connect with the perfect creators for your brand</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by username..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-50 rounded-2xl outline-none transition-all font-medium text-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <select
                                className="appearance-none pl-10 pr-10 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-50 rounded-2xl outline-none transition-all font-bold text-slate-600 text-sm cursor-pointer min-w-[160px]"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                className="appearance-none pl-10 pr-10 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-50 rounded-2xl outline-none transition-all font-bold text-slate-600 text-sm cursor-pointer min-w-[160px]"
                                value={selectedNiche}
                                onChange={(e) => setSelectedNiche(e.target.value)}
                            >
                                <option value="">All Niches</option>
                                {niches.map(niche => <option key={niche} value={niche}>{niche}</option>)}
                            </select>
                            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Quick Filters:</span>
                    <button className="px-4 py-2 bg-purple-50 text-purple-600 text-xs font-bold rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Only
                    </button>
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-2">
                        <Star className="w-3.5 h-3.5" /> High Engagement
                    </button>
                    <button className="px-4 py-2 bg-green-50 text-green-600 text-xs font-bold rounded-xl border border-green-100 hover:bg-green-100 transition-colors flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" /> Top Followed
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="bg-slate-50 h-[300px] rounded-3xl border border-slate-100"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                    <p className="text-red-500 font-bold">{error}</p>
                    <button onClick={getInfluencers} className="mt-4 text-sm font-bold text-red-600 underline">Try again</button>
                </div>
            ) : influencers.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Users className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No influencers found</h3>
                    <p className="text-slate-400 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {influencers.map((inf: any) => (
                        <InfluencerCard
                            key={inf._id}
                            userId={inf.userId?._id || inf._id}
                            fullName={inf.userId?.fullName || "Unknown"}
                            username={inf.username}
                            profilePicture={inf.userId?.profilePicture}
                            bio={inf.bio}
                            location={inf.location}
                            niches={inf.niches}
                            avgRating={inf.avgRating}
                            reviewCount={inf.reviewCount}
                            isVerified={inf.isVerified}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
