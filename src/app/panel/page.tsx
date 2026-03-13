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
import Link from "next/link";
import { PanelCard, type Stat } from "@/components/panel/panel-card";

export default async function PanelIndexPage() {
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
    { count: servicesThisMonth },
    { data: topIssues },
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
      .select("*, assets!inner(owner_id)", { count: "exact", head: true })
      .eq("assets.owner_id", userId)
      .eq("status", "closed")
      .gte("closed_at", firstDayOfMonth),

    supabase
      .from("issues")
      .select("asset_id, assets!inner(name, owner_id)")
      .eq("assets.owner_id", userId),
  ]);

  type AssetIssueMap = Record<
    number,
    { id: string; name: string; count: number }
  >;

  const issuesByAsset = (topIssues ?? []).reduce<AssetIssueMap>(
    (acc, issue) => {
      const id = issue.asset_id;
      if (!id) return acc;
      const name = (issue.assets as any)?.name ?? "—";
      acc[id] = { id, name, count: (acc[id]?.count ?? 0) + 1 };
      return acc;
    },
    {},
  );

  const topAssets = Object.values(issuesByAsset)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const total = assets?.length ?? 0;
  const broken = assets?.filter((a) => a.status === "broken").length ?? 0;
  const maintenance =
    assets?.filter((a) => a.status === "maintenance").length ?? 0;
  const working = assets?.filter((a) => a.status === "working").length ?? 0;

  const isPro = profile?.plan === "pro";
  const limit = isPro ? null : 10;

  const stats: Stat[] = [
    {
      label: "Uszkodzone maszyny",
      value: broken,
      icon: TriangleAlert,
      className: "text-red-600 bg-red-50/50 border-red-200",
      iconClass: "text-red-500",
    },
    {
      label: "Uszkodzone",
      value: broken,
      icon: TriangleAlert,
      className: "text-red-600 bg-red-50/50 border-red-200",
      iconClass: "text-red-500",
    },
    {
      label: "W serwisie",
      value: maintenance,
      icon: Wrench,
      className: "text-yellow-600 bg-yellow-50/50 border-yellow-200",
      iconClass: "text-yellow-500",
    },
    {
      label: "Sprawne",
      value: working,
      icon: CheckCircle,
      className: "text-green-600 bg-green-50/50 border-green-200",
      iconClass: "text-green-500",
    },
    {
      label: "Maszyny",
      value: isPro ? `${total}` : `${total} / ${limit}`,
      icon: Factory,
      className: "text-blue-600 bg-blue-50/50 border-blue-200",
      iconClass: "text-blue-500",
    },

    {
      label: "Awarie w tym miesiącu",
      value: issuesThisMonth ?? 0,
      icon: Calendar,
      className: "text-orange-600 bg-orange-50/50 border-orange-200",
      iconClass: "text-orange-500",
    },
    // {
    //   label: "Serwisy w tym miesiącu",
    //   value: servicesThisMonth ?? 0,
    //   icon: Calendar,
    //   className: "text-purple-600 bg-purple-50/50 border-purple-100",
    //   iconClass: "text-purple-500",
    // },
  ];

  return (
    <section>
      <PageHeader title="Przegląd" />

      {/* Awarie */}
      <h2 className="text-xs font-medium text-gray-400 tracking-wider mb-3">
        Awarie
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats
          .filter((s) =>
            ["Uszkodzone", "Awarie w tym miesiącu"].includes(s.label),
          )
          .map((stat) => (
            <PanelCard key={stat.label} stat={stat} />
          ))}
      </div>

      {/* Maszyny */}
      <h2 className="text-xs font-medium text-gray-400 tracking-wider mb-3">
        Maszyny
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats
          .filter((s) =>
            ["Uszkodzone maszyny", "Sprawne", "W serwisie", "Maszyny"].includes(
              s.label,
            ),
          )
          .map((stat) => (
            <PanelCard key={stat.label} stat={stat} />
          ))}
      </div>

      {/* Serwisy */}
      {/* <h2 className="text-xs font-medium text-gray-400 tracking-wider mb-3">
        Serwisy
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats
          .filter((s) => ["Serwisy w tym miesiącu"].includes(s.label))
          .map((stat) => (
            <PanelCard key={stat.label} stat={stat} />
          ))}
      </div> */}

      {/* Najczęściej psujące się */}
      {topAssets.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={15} className="text-gray-400" />
            <h2 className="text-xs font-medium text-gray-400 tracking-wider">
              Najczęściej psujące się maszyny
            </h2>
          </div>
          <div className="space-y-2 max-w-sm">
            {topAssets.map((asset, i) => (
              <Link
                href={`/panel/maszyny/${asset.id}`}
                key={asset.name}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-primary hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium w-4">{i + 1}.</span>
                  <span className="text-sm  font-medium">{asset.name}</span>
                </div>
                <span className="text-xs">
                  {asset.count}{" "}
                  {asset.count === 1
                    ? "awaria"
                    : asset.count < 5
                      ? "awarie"
                      : "awarii"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
