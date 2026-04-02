"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import IssueCard from "@/components/panel/issue-card";
import { Button } from "@/components/ui/button";
import { ProFeaturesModal } from "@/components/panel/pro-features-modal";
import { Download, FileText, Loader2 } from "lucide-react";
import { getStatus } from "@/lib/utils";
import { useTranslations } from "next-intl";

type DateRange = "all" | "7d" | "14d" | "month" | "prev_month";

function getDateRange(range: DateRange): {
  from: string | null;
  to: string | null;
} {
  const now = new Date();
  const to = now.toISOString();
  if (range === "all") return { from: null, to: null };
  if (range === "7d") {
    const from = new Date(now);
    from.setDate(from.getDate() - 7);
    return { from: from.toISOString(), to };
  }
  if (range === "14d") {
    const from = new Date(now);
    from.setDate(from.getDate() - 14);
    return { from: from.toISOString(), to };
  }
  if (range === "month")
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      to,
    };
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const prevTo = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
  ).toISOString();
  return { from, to: prevTo };
}

interface Issue {
  id: string;
  created_at: string;
  closed_at: string | null;
  description: string | null;
  status: string | null;
  priority: string | null;
  assets: { name: string } | null;
}

interface Props {
  status: string;
  isPro: boolean;
  userId: string;
}

export default function IssuesList({ status, isPro, userId }: Props) {
  const t = useTranslations("panel.issuesList");
  const [range, setRange] = useState<DateRange>("all");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const [counts, setCounts] = useState<Record<DateRange, number | null>>({
    all: null,
    "7d": null,
    "14d": null,
    month: null,
    prev_month: null,
  });

  const ranges: { value: DateRange; label: string }[] = [
    { value: "all", label: t("ranges.all") },
    { value: "7d", label: t("ranges.7d") },
    { value: "14d", label: t("ranges.14d") },
    { value: "month", label: t("ranges.month") },
    { value: "prev_month", label: t("ranges.prev_month") },
  ];

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      const supabase = createClient();
      let query = supabase
        .from("issues")
        .select(
          "id, created_at, closed_at, description, status, priority, assets!inner(name, owner_id, image_url)",
          { count: "exact" },
        )
        .eq("status", status)
        .eq("assets.owner_id", userId)
        .order(status === "closed" ? "closed_at" : "created_at", {
          ascending: false,
        });

      const { from, to } = getDateRange(range);
      if (from) query = query.gte("created_at", from);
      if (to) query = query.lte("created_at", to);

      const { data } = await query;

      setIssues((data as unknown as Issue[]) ?? []);

      const countQueries = await Promise.all(
        (["all", "7d", "14d", "month", "prev_month"] as DateRange[]).map(
          async (r) => {
            let q = supabase
              .from("issues")
              .select("id, assets!inner(owner_id)", {
                count: "exact",
                head: true,
              })
              .eq("status", status)
              .eq("assets.owner_id", userId);

            const { from: f, to: t } = getDateRange(r);
            if (f) q = q.gte("created_at", f);
            if (t) q = q.lte("created_at", t);

            const { count } = await q;
            return [r, count ?? 0] as [DateRange, number];
          },
        ),
      );

      setCounts(Object.fromEntries(countQueries) as Record<DateRange, number>);
      setLoading(false);
    };
    fetchIssues();
  }, [range, status]);

  const exportCsv = async () => {
    setExportingCsv(true);
    const headers = [
      t("csv.id"),
      t("csv.asset"),
      t("csv.status"),
      t("csv.description"),
      t("csv.createdAt"),
      t("csv.closedAt"),
    ];
    const rows = issues.map((i) => [
      i.id,
      i.assets?.name ?? "—",
      getStatus(i.status).label,
      (i.description ?? "").replace(/,/g, " "),
      new Date(i.created_at).toLocaleString(),
      i.closed_at ? new Date(i.closed_at).toLocaleString() : "—",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `issues-${range}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportingCsv(false);
  };

  const exportPdf = async () => {
    setExportingPdf(true);
    const rangeLabel = ranges.find((r) => r.value === range)?.label ?? "";
    const statusLabel = getStatus(status).label;
    const rows = issues
      .map(
        (i) => `
      <tr>
        <td>${i.assets?.name ?? "—"}</td>
        <td>${getStatus(i.status).label}</td>
        <td>${(i.description ?? "—").substring(0, 80)}${(i.description ?? "").length > 80 ? "..." : ""}</td>
        <td>${new Date(i.created_at).toLocaleString()}</td>
        <td>${i.closed_at ? new Date(i.closed_at).toLocaleString() : "—"}</td>
      </tr>
    `,
      )
      .join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>
      body{font-family:ui-sans-serif,system-ui,sans-serif;padding:32px;color:#111;font-size:13px}
      h1{font-size:18px;margin-bottom:4px}p{color:#6b7280;margin:0 0 20px}
      table{width:100%;border-collapse:collapse}
      th{background:#f9fafb;text-align:left;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;border-bottom:1px solid #e5e7eb}
      td{padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top}
      tr:last-child td{border-bottom:none}
    </style></head><body>
      <h1>${t("pdf.title")} — ${statusLabel}</h1>
      <p>${rangeLabel} · ${t("pdf.generated")} ${new Date().toLocaleString()}</p>
      <table><thead><tr>
        <th>${t("pdf.asset")}</th><th>${t("pdf.status")}</th><th>${t("pdf.description")}</th>
        <th>${t("pdf.createdAt")}</th><th>${t("pdf.closedAt")}</th>
      </tr></thead><tbody>${rows}</tbody></table>
    </body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    win?.addEventListener("load", () => {
      win.print();
      URL.revokeObjectURL(url);
    });
    setExportingPdf(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {ranges.map((r) => (
            <Button
              key={r.value}
              variant={range === r.value ? "default" : "outline"}
              onClick={() => setRange(r.value)}
            >
              {r.label}
              {counts[r.value] !== null && (
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-md font-medium ${
                    range === r.value
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {counts[r.value]}
                </span>
              )}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {isPro ? (
            <>
              <Button
                variant="outline"
                onClick={exportCsv}
                disabled={exportingCsv || loading}
              >
                {exportingCsv ? (
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                ) : (
                  <Download size={13} className="mr-1.5" />
                )}
                CSV
              </Button>
              <Button
                variant="outline"
                onClick={exportPdf}
                disabled={exportingPdf || loading}
              >
                {exportingPdf ? (
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                ) : (
                  <FileText size={13} className="mr-1.5" />
                )}
                PDF
              </Button>
            </>
          ) : (
            <ProFeaturesModal text={t("exportPro")} />
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          {t("empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
