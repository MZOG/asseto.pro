import { headers } from "next/headers";
import PageHeader from "@/components/panel/page-header";
import { createClient } from "@/lib/supabase/server";
import {
  TriangleAlert,
  Wrench,
  CheckCircle,
  Factory,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { PanelCard, type Stat } from "@/components/panel/panel-card";
import { ProFeaturesModal } from "@/components/panel/pro-features-modal";
import { Button } from "@/components/ui/button";
import DashboardCharts from "@/components/panel/dashboard-charts";
import { isPro, getPlanLimit } from "@/lib/utils/plan";
import { getTranslations } from "next-intl/server";

export default async function PanelIndexPage() {
  const t = await getTranslations("panel.dashboard");
  const userId = (await headers()).get("x-user-id");
  const supabase = await createClient();

  const now = new Date();
  const firstDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();

  const [
    { data: assets },
    { data: profile },
    { count: issuesThisMonth },
    { data: topIssues },
    { data: upcomingServices },
    { data: chartIssues },
  ] = await Promise.all([
    supabase.from("assets").select("id, status").eq("owner_id", userId),
    supabase.from("profiles").select("plan").eq("id", userId).single(),
    supabase
      .from("issues")
      .select("*, assets!inner(owner_id)", { count: "exact", head: true })
      .eq("assets.owner_id", userId)
      .gte("created_at", firstDayOfMonth),
    supabase
      .from("issues")
      .select("asset_id, assets!inner(name, owner_id)")
      .eq("assets.owner_id", userId),
    supabase
      .from("services")
      .select("id, next_service_at, asset_id, assets!inner(name, owner_id)")
      .eq("assets.owner_id", userId)
      .gte("next_service_at", now.toISOString().split("T")[0])
      .order("next_service_at", { ascending: true })
      .limit(3),
    supabase
      .from("issues")
      .select("created_at, closed_at, status, assets!inner(name, owner_id)")
      .eq("assets.owner_id", userId)
      .gte(
        "created_at",
        new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
        ).toISOString(),
      ),
  ]);

  const issuesByAsset: Record<
    string,
    { id: string; name: string; count: number }
  > = {};
  (topIssues ?? []).forEach((issue) => {
    const id = issue.asset_id;
    if (!id) return;
    const name = (issue.assets as any)?.name ?? "—";
    issuesByAsset[id] = {
      id,
      name,
      count: (issuesByAsset[id]?.count ?? 0) + 1,
    };
  });

  const topAssets = Object.values(issuesByAsset)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const total = assets?.length ?? 0;
  const broken = assets?.filter((a) => a.status === "broken").length ?? 0;
  const maintenance =
    assets?.filter((a) => a.status === "maintenance").length ?? 0;
  const working = assets?.filter((a) => a.status === "working").length ?? 0;
  const userPlan = profile?.plan ?? "free";
  const limit = getPlanLimit(userPlan);

  const getIssueWord = (count: number) => {
    if (count === 1) return t("issue");
    if (count >= 2 && count <= 4) return t("issues2");
    return t("issues5");
  };

  const stats: Stat[] = [
    {
      label: t("stats.broken"),
      value: broken,
      icon: TriangleAlert,
      className: "bg-white border-gray-200",
      iconClass: "text-red-500",
    },
    {
      label: t("stats.issuesThisMonth"),
      value: issuesThisMonth ?? 0,
      icon: Calendar,
      className: "bg-white border-gray-200",
      iconClass: "text-orange-500",
    },
    {
      label: t("stats.brokenAssets"),
      value: broken,
      icon: TriangleAlert,
      className: "bg-white border-gray-200",
      iconClass: "text-red-500",
    },
    {
      label: t("stats.inService"),
      value: maintenance,
      icon: Wrench,
      className: "bg-white border-gray-200",
      iconClass: "text-yellow-500",
    },
    {
      label: t("stats.working"),
      value: working,
      icon: CheckCircle,
      className: "bg-white border-gray-200",
      iconClass: "text-green-500",
    },
    {
      label: t("stats.assets"),
      value: `${total} / ${limit}`,
      icon: Factory,
      className: "bg-white border-gray-200",
      iconClass: "text-blue-500",
    },
  ];

  const mockServices = t.raw("mockServices") as {
    name: string;
    date: string;
  }[];

  return (
    <section>
      <PageHeader title={t("title")} />

      <h2 className="text-xs font-medium text-gray-400 tracking-wider mb-3">
        {t("issues")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats
          .filter((s) =>
            [t("stats.broken"), t("stats.issuesThisMonth")].includes(s.label),
          )
          .map((stat) => (
            <PanelCard key={stat.label} stat={stat} />
          ))}
      </div>

      <h2 className="text-xs font-medium text-gray-400 tracking-wider mb-3">
        {t("machines")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats
          .filter((s) =>
            [
              t("stats.brokenAssets"),
              t("stats.working"),
              t("stats.inService"),
              t("stats.assets"),
            ].includes(s.label),
          )
          .map((stat) => (
            <PanelCard key={stat.label} stat={stat} />
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="mb-6">
          <h2 className="text-xs font-medium text-gray-400 tracking-wider mb-3">
            {t("upcomingServices")}
          </h2>

          {isPro(profile?.plan ?? "free") ? (
            <div className="space-y-2 max-w-sm">
              {(upcomingServices ?? []).length === 0 ? (
                <p className="text-sm text-gray-400">{t("noServices")}</p>
              ) : (
                (upcomingServices ?? []).map((s: any) => {
                  const date = new Date(s.next_service_at).toLocaleDateString(
                    "pl-PL",
                    { day: "numeric", month: "long", year: "numeric" },
                  );
                  const daysLeft = Math.ceil(
                    (new Date(s.next_service_at).getTime() - now.getTime()) /
                      (1000 * 60 * 60 * 24),
                  );
                  const isUrgent = daysLeft <= 7;
                  return (
                    <Link
                      key={s.id}
                      href={{
                        pathname: "/panel/serwisy/[assetId]",
                        params: { assetId: s.asset_id },
                      }}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {(s.assets as any).name}
                      </span>
                      <span
                        className={`text-xs font-medium ${isUrgent ? "text-red-600" : "text-gray-500"}`}
                      >
                        {date}
                      </span>
                    </Link>
                  );
                })
              )}
              <Button asChild variant="secondary">
                <Link href="/panel/serwisy">{t("allServices")}</Link>
              </Button>
            </div>
          ) : (
            <div className="relative max-w-sm">
              <div className="space-y-2 blur-xs pointer-events-none select-none">
                {mockServices.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ProFeaturesModal />
              </div>
            </div>
          )}
        </div>

        {topAssets.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={15} className="text-gray-400" />
              <h2 className="text-xs font-medium text-gray-400 tracking-wider">
                {t("topAssets")}
              </h2>
            </div>
            <div className="space-y-2 max-w-sm">
              {topAssets.map((asset, i) => (
                <Link
                  href={{
                    pathname: "/panel/maszyny/[id]",
                    params: { id: asset.id },
                  }}
                  key={asset.name}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium w-4">{i + 1}.</span>
                    <span className="text-sm font-medium">{asset.name}</span>
                  </div>
                  <span className="text-xs">
                    {asset.count} {getIssueWord(asset.count)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {isPro(profile?.plan ?? "free") ? (
        <>
          <h2 className="text-xs font-medium text-gray-400 tracking-wider mb-3 mt-6">
            {t("analytics")}
          </h2>
          <DashboardCharts
            issues={(chartIssues ?? []).map((i: any) => ({
              created_at: i.created_at,
              closed_at: i.closed_at,
              status: i.status,
              asset_name: i.assets?.name ?? "—",
            }))}
          />
        </>
      ) : (
        <div className="relative mt-6">
          <h2 className="text-xs font-medium text-gray-400 tracking-wider mb-3">
            {t("analytics")}
          </h2>
          <ProFeaturesModal text={t("analyticsProText")} />
        </div>
      )}
    </section>
  );
}
