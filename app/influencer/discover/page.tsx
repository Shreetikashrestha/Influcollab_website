"use client";

import { Search, Bell, Users, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BrandCard from "@/components/BrandCard";

export default function DiscoverBrandsPage() {
    const { user } = useAuth();

    const categories = ["All", "Fashion", "Technology", "Food", "Adventure", "Health", "Photography"];

    const mockBrands = [
        {
            name: "Vajra Style Nepal",
            category: "Fashion",
            rating: 4.8,
            description: "Leading Nepali fashion brand blending tradition with modernity",
            activeCampaigns: 8,
            budgetRange: "NPR 50K - 100K",
            location: "Kathmandu"
        },
        {
            name: "Sherpa Outdoor",
            category: "Adventure Gear",
            rating: 4.7,
            description: "Premium outdoor and trekking equipment manufacturer",
            activeCampaigns: 5,
            budgetRange: "NPR 40K - 80K",
            location: "Pokhara"
        },
        {
            name: "Pure Himalayan Foods",
            category: "Organic Food",
            rating: 4.9,
            description: "Organic food products sourced from local Nepali farmers",
            activeCampaigns: 12,
            budgetRange: "NPR 60K - 120K",
            location: "Kathmandu"
        },
        {
            name: "Nepal Tech Hub",
            category: "Technology",
            rating: 4.6,
            description: "Innovative tech solutions and gadgets for the modern user",
            activeCampaigns: 3,
            budgetRange: "NPR 30K - 90K",
            location: "Lalitpur"
        },
        {
            name: "Annapurna Wellness",
            category: "Health & Wellness",
            rating: 4.8,
            description: "Natural wellness products inspired by Himalayan herbs",
            activeCampaigns: 7,
            budgetRange: "NPR 45K - 85K",
            location: "Kathmandu"
        },
        {
            name: "Himalayan Crafts",
            category: "Handicrafts",
            rating: 4.5,
            description: "Authentic handmade crafts from local artisans",
            activeCampaigns: 4,
            budgetRange: "NPR 25K - 65K",
            location: "Bhaktapur"
        }
    ];

    return (
        <div className="bg-[#fcfcfd] min-h-screen px-8 py-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-[32px] font-black text-slate-900 tracking-tight">Discover</h1>
                <div className="flex items-center gap-4">
                    <button className="relative p-3.5 bg-white shadow-sm rounded-2xl text-slate-400 hover:text-purple-600 hover:shadow-md transition-all border border-slate-50">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 bg-white p-2 pr-4 shadow-sm rounded-full hover:shadow-md transition-all cursor-pointer border border-slate-50">
                        <div className="w-9 h-9 rounded-full bg-auth-gradient p-[1px]">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-white">
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{user?.fullName?.split(' ')[0] || 'User'}</span>
                    </div>
                </div>
            </header>

            <div className="mb-12">
                <h2 className="text-[40px] font-black text-slate-900 tracking-tight mb-2">Discover Brands</h2>
                <p className="text-lg font-medium text-slate-400">Explore collaboration opportunities with top brands</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-12 space-y-8">
                <div className="relative max-w-4xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search brands..."
                        className="w-full bg-white border-none shadow-sm rounded-[24px] pl-16 pr-8 py-6 text-base font-semibold text-slate-700 focus:ring-2 focus:ring-purple-100 placeholder:text-slate-300 transition-all"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${cat === "All"
                                    ? "bg-auth-gradient text-white shadow-lg shadow-purple-100"
                                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Brand Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {mockBrands.map((brand) => (
                    <BrandCard
                        key={brand.name}
                        {...brand}
                    />
                ))}
            </div>
        </div>
    );
}
