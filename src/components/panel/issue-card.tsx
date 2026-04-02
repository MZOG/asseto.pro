"use client";

import { formatDate } from "@/lib/utils";
import StatusBadge from "./status-badge";
import { Link } from "@/i18n/routing";
import PriorityBadge from "./awarie/priority-badge";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Image from "next/image";

interface IssueProps {
  issue: {
    id: string;
    status: string | null;
    description: string | null;
    created_at: string;
    assets: { name: string; image_url?: string | null } | null;
    priority: string | null;
  };
}

export default function IssueCard({ issue }: IssueProps) {
  const t = useTranslations("panel.issueCard");
  const locale = useLocale();

  return (
    <Link
      href={{ pathname: "/panel/awarie/[id]", params: { id: issue.id } }}
      className="group flex bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-600 transition-all"
    >
      {/* Zdjęcie maszyny */}
      <div className="w-30 bg-gray-50 border-r border-gray-100 flex items-center justify-center">
        {issue.assets?.image_url ? (
          <div className="relative w-full h-full">
            <Image
              src={issue.assets.image_url}
              alt={issue.assets.name}
              fill
              className="object-cover"
              loading="eager"
              sizes="size-20"
            />
          </div>
        ) : (
          <div className="w-full h-full min-h-22.5 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-2xl">⚙️</span>
          </div>
        )}
      </div>

      {/* Treść */}
      <div className="flex flex-col flex-1 min-w-0 p-3.5 gap-1.5">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={issue.status} />
          <PriorityBadge priority={issue.priority} />
        </div>

        {/* Nazwa maszyny */}
        <p className="text-sm font-semibold text-gray-900 truncate">
          {issue.assets?.name ?? "—"}
        </p>

        {/* Opis */}
        {issue.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>
        )}

        {/* Data */}
        <p className="text-xs text-gray-400 mt-auto pt-1">
          {t("added")}{" "}
          <span className="font-medium">
            {formatDate(issue.created_at, locale)}
          </span>
        </p>
      </div>
    </Link>
  );
}
