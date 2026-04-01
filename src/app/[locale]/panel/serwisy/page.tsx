import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/panel/page-header";
import NextLink from "next/link";
import { ProFeaturesModal } from "@/components/panel/pro-features-modal";
import { ChevronRight } from "lucide-react";
import { isPro } from "@/lib/utils/plan";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";

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

const statusDot: Record<string, string> = {
  overdue: "bg-red-500",
  soon: "bg-yellow-400",
  ok: "bg-green-500",
  none: "bg-gray-300",
};

const statusText: Record<string, string> = {
  overdue: "text-red-600",
  soon: "text-yellow-600",
};

export default async function SerwisyPage() {
  const t = await getTranslations("panel.servicesPage");
  const locale = await getLocale();
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
      "id, name, location, status, services(serviced_at, next_service_at, type)",
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
      return (
        order[getServiceStatus(a.nextService?.next_service_at)] -
        order[getServiceStatus(b.nextService?.next_service_at)]
      );
    });

  const mockAssets = t.raw("mock") as {
    name: string;
    lastDate: string | null;
    nextDate: string | null;
    status: string;
  }[];
  const dateLocale = locale === "en" ? "en-US" : "pl-PL";
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const legend = [
    { color: "bg-red-500", label: t("legend.overdue") },
    { color: "bg-yellow-400", label: t("legend.soon") },
    { color: "bg-green-500", label: t("legend.ok") },
    { color: "bg-gray-300", label: t("legend.none") },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title={t("title")} />
      </div>

      {!isPro(profile?.plan ?? "free") ? (
        <div className="relative">
          <div className="blur-xs pointer-events-none select-none space-y-2">
            {mockAssets.map((asset, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${statusDot[asset.status]}`}
                  />
                  <p className="text-sm font-semibold text-gray-900">
                    {asset.name}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="mt-3 md:mt-0 text-right">
                    <p className="text-xs text-gray-400 mb-0.5">
                      {t("lastService")}
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {asset.lastDate ?? "—"}
                    </p>
                  </div>
                  <div className="md:text-right mt-3 md:mt-0">
                    <p className="text-xs text-gray-400 mb-0.5">
                      {t("nextService")}
                    </p>
                    <p className="text-xs font-semibold text-gray-700">
                      {asset.nextDate ?? t("notSet")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ProFeaturesModal text={t("proText")} />
          </div>
        </div>
      ) : (
        <>
          {assetsWithService.length === 0 ? (
            <p className="text-sm text-gray-400">{t("noAssets")}</p>
          ) : (
            <div className="space-y-2">
              {assetsWithService.map((asset: any) => {
                const status = getServiceStatus(
                  asset.nextService?.next_service_at,
                );
                const nextDate = asset.nextService?.next_service_at
                  ? new Date(
                      asset.nextService.next_service_at,
                    ).toLocaleDateString(dateLocale, dateOptions)
                  : null;
                const lastDate = asset.lastService?.serviced_at
                  ? new Date(asset.lastService.serviced_at).toLocaleDateString(
                      dateLocale,
                      dateOptions,
                    )
                  : null;

                return (
                  <NextLink
                    key={asset.id}
                    href={`/panel/serwisy/${asset.id}`}
                    className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-3 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${statusDot[status]}`}
                      />
                      <p className="text-sm font-semibold text-gray-900">
                        {asset.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <div className="mt-3 md:mt-0 text-right">
                        <p className="text-xs text-gray-400 mb-0.5">
                          {t("lastService")}
                        </p>
                        <p className="text-xs font-medium text-gray-700">
                          {lastDate ?? "—"}
                        </p>
                      </div>
                      <div className="md:text-right mt-3 md:mt-0">
                        <p className="text-xs text-gray-400 mb-0.5">
                          {t("nextService")}
                        </p>
                        {nextDate ? (
                          <p
                            className={`text-xs font-semibold ${statusText[status] ?? "text-gray-700"}`}
                          >
                            {status === "overdue" && (
                              <span className="mr-1">⚠</span>
                            )}
                            {nextDate}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">{t("notSet")}</p>
                        )}
                      </div>
                      <ChevronRight
                        size={15}
                        className="hidden md:block text-gray-400 group-hover:text-blue-600 transition-colors shrink-0"
                      />
                    </div>
                  </NextLink>
                );
              })}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5 mt-6">
            {legend.map((l) => (
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
