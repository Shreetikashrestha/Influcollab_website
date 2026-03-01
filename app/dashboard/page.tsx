"use client";

import { useEffect, useState } from "react";
import TrendCard from "./TrendCard";
import { useAuth } from "@/context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    revenue: 0,
    announcements: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats({
          revenue: 0,
          announcements: 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="trend-cards">
        <TrendCard
          title="Revenue"
          value={loading ? "—" : `$${(stats.revenue / 1000).toFixed(1)}K`}
          icon="dollar"
          trend="neutral"
        />
        <TrendCard
          title="Announcements"
          value={loading ? "—" : stats.announcements}
          icon="megaphone"
          trend="neutral"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
