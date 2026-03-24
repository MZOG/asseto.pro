"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import IssueCard from "@/components/panel/issue-card";
import { Button } from "@/components/ui/button";
import { ProFeaturesModal } from "@/components/panel/pro-features-modal";
import { useUpgrade } from "@/hooks/use-upgrade";
import { Download, FileText, Loader2 } from "lucide-react";
import { getStatus } from "@/lib/utils";

type DateRange = "7d" | "14d" | "month" | "prev_month";

const ranges: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Ostatnie 7 dni" },
  { value: "14d", label: "Ostatnie 14 dni" },
  { value: "month", label: "Ten miesiąc" },
  { value: "prev_month", label: "Poprzedni miesiąc" },
];

function getDateRange(range: DateRange): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString();

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
  if (range === "month") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    return { from, to };
  }
  // prev_month
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
  const [range, setRange] = useState<DateRange>("7d");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      const supabase = createClient();
      const { from, to } = getDateRange(range);

      const { data } = await supabase
        .from("issues")
        .select(
          "id, created_at, closed_at, description, status, priority, assets!inner(name, owner_id)",
        )
        .eq("status", status)
        .eq("assets.owner_id", userId)
        .gte("created_at", from)
        .lte("created_at", to)
        .order(status === "closed" ? "closed_at" : "created_at", {
          ascending: false,
        });

      setIssues((data as unknown as Issue[]) ?? []);
      setLoading(false);
    };

    fetchIssues();
  }, [range, status]);

  const exportCsv = async () => {
    setExportingCsv(true);

    const headers = [
      "ID",
      "Nazwa maszyny",
      "Status",
      "Opis usterki",
      "Data zgłoszenia",
      "Data zamknięcia",
    ];
    const rows = issues.map((i) => [
      i.id,
      i.assets?.name ?? "—",
      getStatus(i.status).label,
      (i.description ?? "").replace(/,/g, " "),
      new Date(i.created_at).toLocaleString("pl-PL"),
      i.closed_at ? new Date(i.closed_at).toLocaleString("pl-PL") : "—",
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `awarie-${range}-${new Date().toISOString().slice(0, 10)}.csv`;
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
        <td>${new Date(i.created_at).toLocaleString("pl-PL")}</td>
        <td>${i.closed_at ? new Date(i.closed_at).toLocaleString("pl-PL") : "—"}</td>
      </tr>
    `,
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: ui-sans-serif, system-ui, sans-serif; padding: 32px; color: #111; font-size: 13px; }
          h1 { font-size: 18px; margin-bottom: 4px; }
          p { color: #6b7280; margin: 0 0 20px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f9fafb; text-align: left; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
          td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
          tr:last-child td { border-bottom: none; }
        </style>
      </head>
      <body>
        <h1>Awarie — ${statusLabel}</h1>
        <p>${rangeLabel} · Wygenerowano ${new Date().toLocaleString("pl-PL")}</p>
        <table>
          <thead>
            <tr>
              <th>Maszyna</th>
              <th>Status</th>
              <th>Opis</th>
              <th>Data zgłoszenia</th>
              <th>Data zamknięcia</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>
    `;

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
      {/* Filtry + eksport */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {ranges.map((r) => (
            <Button
              key={r.value}
              variant={range === r.value ? "default" : "outline"}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>

        {/* Eksport */}
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
            <ProFeaturesModal text="Eksport dostępny w Pro" />
          )}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          Brak awarii w wybranym okresie.
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
