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
import { priorityConfig, type Priority } from "@/lib/utils/priority";
import { useTranslations } from "next-intl";

export default function PrioritySelect({
  issueId,
  currentPriority,
}: {
  issueId: string;
  currentPriority: string | null;
}) {
  const t = useTranslations("panel.issuePage");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (value: Priority) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("issues")
      .update({ priority: value })
      .eq("id", issueId);
    if (error) {
      toast.error(t("errorPriority"));
      setLoading(false);
      return;
    }
    toast.success(t("successPriority"));
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 size={13} className="animate-spin text-gray-400" />}
      <Select
        value={currentPriority ?? "normal"}
        onValueChange={handleChange}
        disabled={loading}
      >
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(priorityConfig).map(([value, config]) => (
            <SelectItem key={value} value={value}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`}
                />
                <span>{t(`priorities.${value as Priority}`)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
