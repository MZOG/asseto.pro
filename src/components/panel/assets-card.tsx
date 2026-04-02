"use client";

import StatusBadge from "./status-badge";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

interface AssetsProps {
  asset: {
    id: number;
    name: string;
    status: string;
    serial_number: string;
    created_at: string;
    image_url?: string | null;
    issues: {};
  };
}

export default function AssetsCard({ asset }: AssetsProps) {
  const t = useTranslations("panel.assetsCard");
  const issuesCount = (asset.issues as any)[0].count;

  return (
    <Link
      href={{ pathname: "/panel/maszyny/[id]", params: { id: asset.id } }}
      className="group flex bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-600 transition-all"
    >
      {/* Zdjęcie */}
      <div className="w-30 shrink-0 border-r border-gray-100">
        {asset.image_url ? (
          <div className="relative w-full h-full min-h-25">
            <Image
              src={asset.image_url}
              sizes="80px"
              alt={asset.name}
              fill
              className="object-cover"
              loading="eager"
            />
          </div>
        ) : (
          <div className="w-full h-full min-h-25 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-2xl">⚙️</span>
          </div>
        )}
      </div>

      {/* Treść */}
      <div className="flex flex-col flex-1 min-w-0 p-3.5 gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={asset.status} />
          {issuesCount > 0 && (
            <span className="text-xs font-medium bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md">
              {t("issuesCount")} {issuesCount}
            </span>
          )}
        </div>

        <p className="text-sm font-semibold text-gray-900 truncate">
          {asset.name}
        </p>

        {asset.serial_number && (
          <p className="text-xs text-gray-400 truncate">
            {t("serialNumber")}{" "}
            <span className="font-medium text-gray-600">
              {asset.serial_number}
            </span>
          </p>
        )}

        {/* Quick report */}
      </div>
    </Link>
  );
}
