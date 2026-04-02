"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Trash2,
  Wrench,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface Service {
  id: string;
  serviced_at: string;
  next_service_at: string | null;
  type: string;
  performed_by: string | null;
  cost: number | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;
}

export default function ServiceHistory({
  services,
  assetId,
}: {
  services: Service[];
  assetId: string;
}) {
  const t = useTranslations("panel.serviceHistory");
  const locale = useLocale();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(
    services[0]?.id ?? null,
  );
  const [deleting, setDeleting] = useState<string | null>(null);

  const typeConfig: Record<
    string,
    { label: string; className: string; icon: any }
  > = {
    inspection: {
      label: t("types.inspection"),
      className: "bg-blue-100 text-blue-700",
      icon: Search,
    },
    repair: {
      label: t("types.repair"),
      className: "bg-orange-100 text-orange-700",
      icon: Wrench,
    },
    replacement: {
      label: t("types.replacement"),
      className: "bg-purple-100 text-purple-700",
      icon: RefreshCw,
    },
  };

  const dateLocale = locale === "en" ? "en-US" : "pl-PL";
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const supabase = createClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error(t("errorDelete"));
    else {
      toast.success(t("successDelete"));
      router.refresh();
    }
    setDeleting(null);
  };

  if (services.length === 0)
    return <p className="text-sm text-gray-400">{t("empty")}</p>;

  return (
    <div className="space-y-2">
      {services.map((service) => {
        const type = typeConfig[service.type] ?? typeConfig.inspection;
        const TypeIcon = type.icon;
        const isExpanded = expanded === service.id;
        const date = new Date(service.serviced_at).toLocaleDateString(
          dateLocale,
          dateOptions,
        );
        const nextDate = service.next_service_at
          ? new Date(service.next_service_at).toLocaleDateString(
              dateLocale,
              dateOptions,
            )
          : null;

        return (
          <div
            key={service.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(isExpanded ? null : service.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${type.className}`}
                >
                  <TypeIcon size={11} />
                  {type.label}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {date}
                </span>
                {service.performed_by && (
                  <span className="text-xs text-gray-400 hidden sm:block">
                    · {service.performed_by}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {service.cost && (
                  <span className="text-xs font-medium text-gray-600 hidden sm:block">
                    {service.cost.toLocaleString(dateLocale)}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp size={15} className="text-gray-400" />
                ) : (
                  <ChevronDown size={15} className="text-gray-400" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                {service.notes && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{t("notes")}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {service.notes}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {service.performed_by && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        {t("performedBy")}
                      </p>
                      <p className="text-gray-700 font-medium">
                        {service.performed_by}
                      </p>
                    </div>
                  )}
                  {service.cost && (
                    // TODO: Add currency
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        {t("cost")}
                      </p>
                      <p className="text-gray-700 font-medium">
                        {service.cost.toLocaleString(dateLocale)}
                      </p>
                    </div>
                  )}
                  {nextDate && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        {t("nextService")}
                      </p>
                      <p className="text-gray-700 font-medium">{nextDate}</p>
                    </div>
                  )}
                </div>
                {service.image_url && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">{t("photo")}</p>
                    <img
                      src={service.image_url}
                      alt={t("photoAlt")}
                      className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <div className="flex justify-end pt-1">
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(service.id)}
                    disabled={deleting === service.id}
                    className="text-gray-400 hover:text-red-500 text-xs"
                  >
                    <Trash2 size={13} className="mr-1.5" />
                    {t("delete")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
