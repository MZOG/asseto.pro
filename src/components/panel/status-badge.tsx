import { cn, getStatus } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { CheckCircle2, TriangleAlert, Wrench, XCircle } from "lucide-react";

const statusIcons: Record<string, React.ReactNode> = {
  working: <CheckCircle2 size={12} />,
  maintenance: <Wrench size={12} />,
  broken: <TriangleAlert size={12} />,
  closed: <XCircle size={12} />,
};

export default function StatusBadge({ status }: { status: string | null }) {
  const { label, className } = getStatus(status);
  const icon = statusIcons[status ?? ""];

  return (
    <Badge className={cn(className)}>
      {icon}
      {label}
    </Badge>
  );
}
