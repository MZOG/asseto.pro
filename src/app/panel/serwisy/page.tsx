import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/panel/page-header";
import Link from "next/link";
import { ProFeaturesModal } from "@/components/panel/pro-features-modal";
import { ChevronRight } from "lucide-react";
import { isPro } from "@/lib/utils/plan";

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

const mockAssets = [
  {
    name: "Maszyna przykładowa",
    lastDate: "12 stycznia 2025",
    nextDate: "12 kwietnia 2025",
    status: "ok",
  },
  {
    name: "Urządzenie nr 2",
    lastDate: "5 lutego 2025",
    nextDate: "5 marca 2025",
    status: "soon",
  },
  { name: "Sprzęt w hali A", lastDate: null, nextDate: null, status: "none" },
];

export default async function SerwisyPage() {
  const userId = (await headers()).get("x-user-id");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  const { data: assets } = await supabase
    .from("assets")
    .select(
      `id, name, location, status, services(serviced_at, next_service_at, type)`,
    )
    .eq("owner_id", userId)
    .order("name", { ascending: true });

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
      const order = { overdue: 0, soon: 1, ok: 2, none: 3 };
      const aStatus = getServiceStatus(a.nextService?.next_service_at);
      const bStatus = getServiceStatus(b.nextService?.next_service_at);
      return order[aStatus] - order[bStatus];
    });

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Serwisy" />
      </div>

      {!isPro(profile?.plan ?? "free") ? (
        // ── Free — zblurowany podgląd
        <div className="relative">
          <div className="blur-xs pointer-events-none select-none space-y-2">
            {mockAssets.map((asset, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      asset.status === "overdue"
                        ? "bg-red-500"
                        : asset.status === "soon"
                          ? "bg-yellow-400"
                          : asset.status === "ok"
                            ? "bg-green-500"
                            : "bg-gray-300"
                    }`}
                  />
                  <p className="text-sm font-semibold text-gray-900">
                    {asset.name}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="mt-3 md:mt-0 text-right">
                    <p className="text-xs text-gray-400 mb-0.5">
                      Ostatni serwis
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {asset.lastDate ?? "—"}
                    </p>
                  </div>
                  <div className="md:text-right mt-3 md:mt-0">
                    <p className="text-xs text-gray-400 mb-0.5">
                      Następny serwis
                    </p>
                    <p className="text-xs font-semibold text-gray-700">
                      {asset.nextDate ?? "Nie ustawiono"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ProFeaturesModal text="Serwisy dostępne w planie Pro" />
          </div>
        </div>
      ) : (
        // ── Pro — pełny widok
        <>
          {assetsWithService.length === 0 ? (
            <p className="text-sm text-gray-400">
              Brak maszyn. Dodaj maszynę aby śledzić jej serwisy.
            </p>
          ) : (
            <div className="space-y-2">
              {assetsWithService.map((asset: any) => {
                const status = getServiceStatus(
                  asset.nextService?.next_service_at,
                );
                const nextDate = asset.nextService?.next_service_at
                  ? new Date(
                      asset.nextService.next_service_at,
                    ).toLocaleDateString("pl-PL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
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
                    className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-3 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-2">
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
                      <p className="text-sm font-semibold text-gray-900">
                        {asset.name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                      <div className="mt-3 md:mt-0 text-right">
                        <p className="text-xs text-gray-400 mb-0.5">
                          Ostatni serwis
                        </p>
                        <p className="text-xs font-medium text-gray-700">
                          {lastDate ?? "—"}
                        </p>
                      </div>
                      <div className="md:text-right mt-3 md:mt-0">
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
                        className="hidden md:block text-gray-400 group-hover:text-blue-600 transition-colors shrink-0"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Legenda */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5 mt-6">
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
        </>
      )}
    </section>
  );
}
