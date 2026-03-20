// src/components/panel/dashboard-charts.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

interface Issue {
  created_at: string;
  closed_at: string | null;
  status: string | null;
  asset_name: string;
}

interface Props {
  issues: Issue[];
}

const STATUS_COLORS: Record<string, string> = {
  broken: "#ef4444",
  maintenance: "#f59e0b",
  closed: "#6b7280",
  working: "#22c55e",
};

const STATUS_LABELS: Record<string, string> = {
  broken: "Uszkodzone",
  maintenance: "W serwisie",
  closed: "Zamknięte",
};

export default function DashboardCharts({ issues }: Props) {
  // ── 1. Awarie w czasie (ostatnie 30 dni, grupowane po dniach)
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  const issuesByDay = days.map((day) => ({
    date: day.slice(5), // MM-DD
    count: issues.filter((i) => i.created_at.startsWith(day)).length,
  }));

  // ── 2. Statusy awarii (pie)
  const statusCounts = Object.entries(
    issues.reduce<Record<string, number>>((acc, i) => {
      const s = i.status ?? "unknown";
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([status, value]) => ({
    name: STATUS_LABELS[status] ?? status,
    value,
    color: STATUS_COLORS[status] ?? "#94a3b8",
  }));

  // ── 3. Najczęściej psujące się maszyny (top 5)
  const assetCounts = Object.entries(
    issues.reduce<Record<string, number>>((acc, i) => {
      acc[i.asset_name] = (acc[i.asset_name] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // ── 4. Średni czas zamknięcia (w dniach)
  const closedIssues = issues.filter(
    (i) => i.status === "closed" && i.closed_at,
  );
  const avgDays = closedIssues.length
    ? (
        closedIssues.reduce((sum, i) => {
          const diff =
            new Date(i.closed_at!).getTime() - new Date(i.created_at).getTime();
          return sum + diff / (1000 * 60 * 60 * 24);
        }, 0) / closedIssues.length
      ).toFixed(1)
    : null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">
            {p.value} {p.name === "count" ? "awarii" : ""}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Stat — średni czas zamknięcia */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-gray-200 rounded-xl col-span-1">
          <p className="text-xs text-gray-400 mb-1">
            Śr. czas zamknięcia awarii
          </p>
          {avgDays !== null ? (
            <>
              <p className="text-3xl font-bold text-gray-900">{avgDays}</p>
              <p className="text-xs text-gray-400 mt-0.5">dni</p>
            </>
          ) : (
            <p className="text-sm text-gray-400 mt-2">
              Brak zamkniętych awarii
            </p>
          )}
        </div>

        {/* Pie — statusy */}
        <div className="bg-white border-gray-200 rounded-xl col-span-1 sm:col-span-2">
          <p className="text-xs font-medium text-gray-400 tracking-wider mb-3">
            Statusy awarii
          </p>
          {statusCounts.length === 0 ? (
            <p className="text-sm text-gray-400">Brak danych.</p>
          ) : (
            <div className="flex items-center gap-4">
              <PieChart width={100} height={100}>
                <Pie
                  data={statusCounts}
                  cx={45}
                  cy={45}
                  innerRadius={28}
                  outerRadius={45}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {statusCounts.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="space-y-1.5">
                {statusCounts.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: s.color }}
                    />
                    <span className="text-gray-600">{s.name}</span>
                    <span className="font-semibold text-gray-900 ml-auto">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ranking — najczęściej psujące się */}
      <div className="my-10">
        <p className="text-xs font-medium text-gray-400 tracking-wider mb-4">
          Najczęściej psujące się maszyny
        </p>
        {assetCounts.length === 0 ? (
          <p className="text-sm text-gray-400">Brak danych.</p>
        ) : (
          <div className="space-y-3">
            {assetCounts.map((asset, i) => {
              const max = assetCounts[0].count;
              const pct = Math.round((asset.count / max) * 100);
              return (
                <div key={asset.name} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-300 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 ">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 ">
                        {asset.name}
                      </span>
                      <span className="text-xs font-semibold text-gray-900 ml-2 shrink-0">
                        {asset.count}{" "}
                        {asset.count === 1
                          ? "awaria"
                          : asset.count < 5
                            ? "awarie"
                            : "awarii"}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Line — awarie w czasie */}
      <div>
        <p className="text-xs font-medium text-gray-400 tracking-wider mb-4">
          Awarie w czasie (ostatnie 30 dni)
        </p>
        {issues.length === 0 ? (
          <p className="text-sm text-gray-400">Brak danych.</p>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart
              data={issuesByDay}
              margin={{ left: -20, right: 8, top: 4, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
