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
            {stats.map((stat) => (
                <DashboardStatCard
                    key={stat.name}
                    title={stat.name}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                />
            ))}
        </div>
    );
}
