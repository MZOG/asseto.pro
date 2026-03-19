import { getPriority } from "@/lib/utils/priority";
import { cn } from "@/lib/utils";

export default function PriorityBadge({
  priority,
  className,
}: {
  priority: string | null;
  className?: string;
}) {
  const { label, dot } = getPriority(priority);

  // Nie pokazuj badge dla normalnego priorytetu — nie zaśmiecaj UI
  if (!priority || priority === "normal") return null;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
}
