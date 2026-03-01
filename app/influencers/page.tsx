"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Users } from "lucide-react";
import { fetchInfluencers } from "@/lib/api/influencer";
import InfluencerCard from "@/components/InfluencerCard";
import { debounce } from "lodash";

export default function FindInfluencersPage() {
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const getInfluencers = async () => {
        try {
            setLoading(true);
            const response = await fetchInfluencers({
                search: searchQuery
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
        [searchQuery]
    );

    useEffect(() => {
        debouncedFetch();
        return debouncedFetch.cancel;
    }, [searchQuery, debouncedFetch]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Find Influencers</h1>
                <p className="text-slate-500 font-medium">Discover and connect with the perfect creators for your brand</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by username..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-50 rounded-2xl outline-none transition-all font-medium text-slate-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
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
