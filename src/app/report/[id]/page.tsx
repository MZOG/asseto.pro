import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReportForm from "@/components/public/report-form";
import StatusBadge from "@/components/panel/status-badge";
import { ScanLine } from "lucide-react";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: asset }, { data: activeIssue }] = await Promise.all([
    supabase.from("assets").select("id, name").eq("id", id).single(),

    supabase
      .from("issues")
      .select("description, status, created_at")
      .eq("asset_id", id)
      .eq("status", "broken")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (!asset) notFound();

  return (
    <div className="min-h-dvh bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center">
            <ScanLine size={16} className="text-white" />
          </div>
          <span className="text-gray-900 font-medium text-lg tracking-tight">
            Asseto
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="mb-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
              Zgłoszenie usterki
            </p>
            <h1 className="text-gray-900 font-semibold text-lg">
              {asset.name}
            </h1>
          </div>

          {activeIssue ? (
            <ActiveIssueInfo issue={activeIssue} />
          ) : (
            <ReportForm assetId={asset.id} />
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} Asseto
        </p>
      </div>
    </div>
  );
}

function ActiveIssueInfo({
  issue,
}: {
  issue: {
    description: string | null;
    status: string | null;
    created_at: string;
  };
}) {
  const date = new Date(issue.created_at).toLocaleString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
        <p className="text-red-700 text-sm font-medium">
          Maszyna jest już zgłoszona
        </p>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            Opis usterki
          </p>
          <p className="text-gray-700">{issue.description ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            Data zgłoszenia
          </p>
          <p className="text-gray-700">{date}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
            Status
          </p>
          <StatusBadge status={issue.status} />
        </div>
      </div>
    </div>
  );
}
