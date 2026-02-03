type TrendCardProps = {
  title: string;
  value: string | number;
  icon: string; // Changed from ReactNode/object to string
  trend: string;
};

import { MegaphoneIcon, ChartIcon, DollarIcon } from './icons';

const iconMap: Record<string, React.ReactNode> = {
  megaphone: <MegaphoneIcon />,
  chart: <ChartIcon />,
  dollar: <DollarIcon />,
  // ...add more icons as needed
};

export default function TrendCard({ title, value, icon, trend }: TrendCardProps) {
  // ...existing code...
  return (
    <div>
      {/* ...existing code... */}
      <span>{iconMap[icon]}</span>
      {/* ...existing code... */}
    </div>
  );
}