import React from "react";
import TrendCard from "../../components/TrendCard";

const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="trend-cards">
        <TrendCard
          title="Revenue"
          value="$16K"
          icon="dollar" // Changed from icon={{$$typeof: ..., render: ...}} to string key
          trend="up"
        />
        <TrendCard
          title="Announcements"
          value={0}
          icon="megaphone" // Changed from icon={{$$typeof: ..., render: ...}} to string key
          trend="neutral"
        />
        {/* ...existing TrendCard components... */}
      </div>
    </div>
  );
};

export default DashboardPage;