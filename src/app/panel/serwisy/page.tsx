// src/app/panel/serwisy/page.tsx
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/panel/page-header";
import Link from "next/link";
import { ProFeaturesModal } from "@/components/panel/pro-features-modal";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
} from "lucide-react";

function getServiceStatus(nextServiceAt: string | null) {
  if (!nextServiceAt) return "none";
  const today = new Date();
  const next = new Date(nextServiceAt);
  const diffDays = Math.ceil(
    (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 0) return "overdue";
  if (diffDays <= 14) return "soon";
  return "ok";
}

export default async function SerwisyPage() {
  const userId = (await headers()).get("x-user-id");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  const isPro = profile?.plan === "pro";

  const { data: assets } = await supabase
    .from("assets")
    .select(
      `
      id, name, location, status,
      services(serviced_at, next_service_at, type)
    `,
    )
    .eq("owner_id", userId)
    .order("name", { ascending: true });

  // Dla każdej maszyny — ostatni i następny serwis
  const assetsWithService = (assets ?? [])
    .map((asset: any) => {
      const sorted = [...(asset.services ?? [])].sort(
        (a: any, b: any) =>
          new Date(b.serviced_at).getTime() - new Date(a.serviced_at).getTime(),
      );
      const last = sorted[0] ?? null;
      const upcoming =
        [...(asset.services ?? [])]
          .filter((s: any) => s.next_service_at)
          .sort(
            (a: any, b: any) =>
              new Date(a.next_service_at).getTime() -
              new Date(b.next_service_at).getTime(),
          )[0] ?? null;

      return { ...asset, lastService: last, nextService: upcoming };
    })
    .sort((a: any, b: any) => {
      // Sortuj: przeterminowane → wkrótce → reszta
      const order = { overdue: 0, soon: 1, ok: 2, none: 3 };
      const aStatus = getServiceStatus(a.nextService?.next_service_at);
      const bStatus = getServiceStatus(b.nextService?.next_service_at);
      return order[aStatus] - order[bStatus];
    });

  if (!isPro) {
    return (
      <section>
        <PageHeader title="Serwisy" />
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-gray-400" />
          </div>
          <h2 className="text-gray-900 font-semibold mb-2">
            Funkcja dostępna w planie Pro
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Zarządzanie serwisami, historia przeglądów i powiadomienia o
            zbliżających się serwisach.
          </p>
          <ProFeaturesModal />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Serwisy" />
      </div>

      {assetsWithService.length === 0 ? (
        <p className="text-sm text-gray-400">
          Brak maszyn. Dodaj maszynę aby śledzić jej serwisy.
        </p>
      ) : (
        <div className="space-y-2">
          {assetsWithService.map((asset: any) => {
            const status = getServiceStatus(asset.nextService?.next_service_at);
            const nextDate = asset.nextService?.next_service_at
              ? new Date(asset.nextService.next_service_at).toLocaleDateString(
                  "pl-PL",
                  { day: "numeric", month: "long", year: "numeric" },
                )
              : null;
            const lastDate = asset.lastService?.serviced_at
              ? new Date(asset.lastService.serviced_at).toLocaleDateString(
                  "pl-PL",
                  { day: "numeric", month: "long", year: "numeric" },
                )
              : null;

            return (
              <Link
                key={asset.id}
                href={`/panel/serwisy/${asset.id}`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Status indicator */}
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      status === "overdue"
                        ? "bg-red-500"
                        : status === "soon"
                          ? "bg-yellow-400"
                          : status === "ok"
                            ? "bg-green-500"
                            : "bg-gray-300"
                    }`}
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {asset.name}
                    </p>
                    {asset.location && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {asset.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Ostatni serwis */}
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-gray-400 mb-0.5">
                      Ostatni serwis
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {lastDate ?? "—"}
                    </p>
                  </div>

                  {/* Następny serwis */}
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">
                      Następny serwis
                    </p>
                    {nextDate ? (
                      <p
                        className={`text-xs font-semibold ${
                          status === "overdue"
                            ? "text-red-600"
                            : status === "soon"
                              ? "text-yellow-600"
                              : "text-gray-700"
                        }`}
                      >
                        {status === "overdue" && (
                          <span className="mr-1">⚠</span>
                        )}
                        {nextDate}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Nie ustawiono</p>
                    )}
                  </div>

                  <ChevronRight
                    size={15}
                    className="text-gray-400 group-hover:text-blue-600 transition-colors shrink-0"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Legenda */}
      <div className="flex items-center gap-5 mt-6">
        {[
          { color: "bg-red-500", label: "Przeterminowany" },
          { color: "bg-yellow-400", label: "Za 14 dni lub mniej" },
          { color: "bg-green-500", label: "Zaplanowany" },
          { color: "bg-gray-300", label: "Brak daty" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className="text-xs text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
