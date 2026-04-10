import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReportForm from "@/components/public/report-form";
import { ScanQrCode } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import ActiveIssueInfo from "@/components/public/active-issue-info";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("reportPage");
  const locale = await getLocale();
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
            <ScanQrCode size={16} className="text-white" />
          </div>
          <span className="text-gray-900 font-medium text-lg tracking-tight">
            Asseto
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="mb-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
              {t("badge")}
            </p>
            <h1 className="text-gray-900 font-semibold text-lg">
              {asset.name}
            </h1>
          </div>

          {activeIssue ? (
            <ActiveIssueInfo issue={activeIssue} locale={locale} />
          ) : (
            <ReportForm assetId={asset.id} />
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
}
