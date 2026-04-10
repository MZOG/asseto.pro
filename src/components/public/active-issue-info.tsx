"use client";

import StatusBadge from "@/components/panel/status-badge";
import { useTranslations } from "next-intl";

interface Props {
  issue: {
    description: string | null;
    status: string | null;
    created_at: string;
  };
  locale: string;
}

export default function ActiveIssueInfo({ issue, locale }: Props) {
  const t = useTranslations("reportPage");

  const date = new Date(issue.created_at).toLocaleString(
    locale === "en" ? "en-US" : locale === "de" ? "de-DE" : "pl-PL",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
        <p className="text-red-700 text-sm font-medium">
          {t("alreadyReported")}
        </p>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            {t("issueDescription")}
          </p>
          <p className="text-gray-700">{issue.description ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            {t("reportedAt")}
          </p>
          <p className="text-gray-700">{date}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
            {t("status")}
          </p>
          <StatusBadge status={issue.status} />
        </div>
      </div>
    </div>
  );
}
