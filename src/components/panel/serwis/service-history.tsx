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

import { serviceTypeConfig } from "@/lib/utils/service";

const typeConfig = {
  inspection: {
    label: "Przegląd",
    className: "bg-blue-100 text-blue-700",
    icon: Search,
  },
  repair: {
    label: "Naprawa",
    className: "bg-orange-100 text-orange-700",
    icon: Wrench,
  },
  replacement: {
    label: "Wymiana części",
    className: "bg-purple-100 text-purple-700",
    icon: RefreshCw,
  },
};

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
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(
    services[0]?.id ?? null,
  );
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const supabase = createClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast.error("Nie udało się usunąć.");
    } else {
      toast.success("Wpis usunięty.");
      router.refresh();
    }
    setDeleting(null);
  };

  if (services.length === 0) {
    return <p className="text-sm text-gray-400">Brak wpisów serwisowych.</p>;
  }

  return (
    <div className="space-y-2">
      {services.map((service) => {
        const type =
          serviceTypeConfig[service.type as keyof typeof serviceTypeConfig] ??
          serviceTypeConfig.inspection;
        const TypeIcon = type.icon;
        const isExpanded = expanded === service.id;
        const date = new Date(service.serviced_at).toLocaleDateString("pl-PL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const nextDate = service.next_service_at
          ? new Date(service.next_service_at).toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : null;

        return (
          <div
            key={service.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            {/* Header */}
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
                    {service.cost.toLocaleString("pl-PL")} zł
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp size={15} className="text-gray-400" />
                ) : (
                  <ChevronDown size={15} className="text-gray-400" />
                )}
              </div>
            </button>

            {/* Expanded */}
            {isExpanded && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                {service.notes && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Notatki</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {service.notes}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {service.performed_by && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Wykonał</p>
                      <p className="text-gray-700 font-medium">
                        {service.performed_by}
                      </p>
                    </div>
                  )}
                  {service.cost && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Koszt</p>
                      <p className="text-gray-700 font-medium">
                        {service.cost.toLocaleString("pl-PL")} zł
                      </p>
                    </div>
                  )}
                  {nextDate && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        Następny serwis
                      </p>
                      <p className="text-gray-700 font-medium">{nextDate}</p>
                    </div>
                  )}
                </div>

                {service.image_url && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Zdjęcie</p>
                    <img
                      src={service.image_url}
                      alt="Zdjęcie serwisu"
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
                    Usuń wpis
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
