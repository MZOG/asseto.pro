import { LucideIcon } from "lucide-react";

export interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  iconClass?: string;
}

interface PanelCardProps {
  stat: Stat;
}

export function PanelCard({ stat }: PanelCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 flex items-center gap-3 ${stat.className}`}
    >
      <div className="p-2 rounded-lg bg-white/60">
        <stat.icon size={20} className={stat.iconClass} />
      </div>
      <div>
        <p className="text-lg font-semibold leading-none">{stat.value}</p>
        <p className="text-xs mt-1 opacity-90 font-medium">{stat.label}</p>
      </div>
    </div>
  );
}
