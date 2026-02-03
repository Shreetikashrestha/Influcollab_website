"use client";

import DashboardStatCard from "@/components/DashboardStatCard";
import { LucideIcon } from "lucide-react";

interface Stat {
    name: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
}

interface BrandStatsGridProps {
    stats: Stat[];
}

export default function BrandStatsGrid({ stats }: BrandStatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <DashboardStatCard
                        key={stat.name}
                        title={stat.name}
                        value={stat.value}
                        icon={<Icon className="w-6 h-6 text-purple-600" />}
                        trend={stat.trend}
                    />
                );
            })}
        </div>
    );
}
