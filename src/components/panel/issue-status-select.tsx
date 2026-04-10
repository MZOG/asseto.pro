"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export default function IssueStatusSelect({
  issueId,
  currentStatus,
}: {
  issueId: string;
  currentStatus: string | null;
}) {
  const t = useTranslations("panel.issuePage");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const statuses = [
    { value: "broken", label: t("statuses.broken"), className: "text-red-600" },
    {
      value: "maintenance",
      label: t("statuses.maintenance"),
      className: "text-yellow-600",
    },
    {
      value: "closed",
      label: t("statuses.closed"),
      className: "text-gray-500",
    },
  ];

  const handleChange = async (value: string) => {
    setLoading(true);
    const supabase = createClient();
    const updates: Record<string, unknown> = {
      status: value,
      updated_at: new Date().toISOString(),
    };
    if (value === "closed") updates.closed_at = new Date().toISOString();
    const { error } = await supabase
      .from("issues")
      .update(updates)
      .eq("id", issueId);
    if (error) {
      toast.error(t("errorStatus"));
      setLoading(false);
      return;
    }
    toast.success(t("successStatus"));
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 size={14} className="animate-spin text-gray-400" />}
      <Select
        value={currentStatus ?? "broken"}
        onValueChange={handleChange}
        disabled={loading}
      >
        <SelectTrigger className="w-40 h-8 text-sm bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              <span className={s.className}>{s.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
