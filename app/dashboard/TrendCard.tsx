import React from "react";

// Example SVG icon components
const MegaphoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FFD700" /></svg>
);
const DollarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" fill="#00C853" /></svg>
);

const iconMap: Record<string, React.ReactNode> = {
  megaphone: <MegaphoneIcon />,
  dollar: <DollarIcon />,
  // ...add more icons as needed
};

type TrendCardProps = {
  title: string;
  value: string | number;
  icon: string; // Now a string key
  trend: string;
};

const TrendCard = ({ title, value, icon, trend }: TrendCardProps) => {
  return (
    <div className="trend-card">
      <span className="trend-card-icon">{iconMap[icon]}</span>
      <div className="trend-card-content">
        <h2>{title}</h2>
        <p>{value}</p>
        <span>{trend}</span>
      </div>
    </div>
  );
};

export default TrendCard;
