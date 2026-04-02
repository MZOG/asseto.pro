"use client";

import NextLink from "next/link";
import { formatDate } from "@/lib/utils";
import { getPriority } from "@/lib/utils/priority";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import StatusBadge from "../status-badge";

interface Issue {
  id: string;
  created_at: string;
  description: string | null;
  status: string | null;
  priority: string | null;
}

export default function AssetIssuesTab({ issues }: { issues: Issue[] }) {
  const t = useTranslations("panel.assetIssuesTab");
  const locale = useLocale();

  if (issues.length === 0)
    return <p className="text-sm text-gray-400">{t("empty")}</p>;

  return (
    <div className="space-y-2">
      {issues.map((issue) => {
        const priority = getPriority(issue.priority);

        return (
          <NextLink
            key={issue.id}
            href={`/panel/awarie/${issue.id}`}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {issue.priority && issue.priority !== "normal" && (
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}
                    />
                    <span className="text-xs text-gray-500">
                      {t(`priorities.${issue.priority}`)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700 truncate">
                {issue.description ?? "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(issue.created_at, locale)}
              </p>
            </div>
            <div className="ml-3 shrink-0">
              <StatusBadge status={issue.status} />
            </div>
          </NextLink>
        );
      })}
    </div>
  );
}
