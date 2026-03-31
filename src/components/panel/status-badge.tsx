"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { CheckCircle2, TriangleAlert, Wrench, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const statusIcons: Record<string, React.ReactNode> = {
  working: <CheckCircle2 size={12} />,
  maintenance: <Wrench size={12} />,
  broken: <TriangleAlert size={12} />,
  closed: <XCircle size={12} />,
};

const statusClassName: Record<string, string> = {
  broken: "bg-red-100 text-red-700",
  maintenance: "bg-yellow-100 text-yellow-700",
  working: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-500",
};

export default function StatusBadge({ status }: { status: string | null }) {
  const t = useTranslations("common.status");

  const label = status ? (t(status as any) ?? t("unknown")) : t("unknown");
  const className =
    statusClassName[status ?? ""] ?? "bg-gray-100 text-gray-500";
  const icon = statusIcons[status ?? ""];

  return (
    <Badge className={cn(className)}>
      {icon}
      {label}
    </Badge>
  );
}
