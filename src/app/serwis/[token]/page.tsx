import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ScanQrCode } from "lucide-react";
import ServiceIssueHistory from "@/components/panel/serwisExternal/service-issue-history";
import ServiceHistory from "@/components/panel/serwisExternal/service-history";
// import AddServiceNoteForm from '@/components/panel/serwisExternal/'
import AddServiceEntryForm from "@/components/panel/serwisExternal/add-service-entry-form";

export default async function SerwisantPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  // Znajdź maszynę po tokenie
  const { data: asset } = await supabase
    .from("assets")
    .select(
      "id, name, location, status, serial_number, reference_number, image_url",
    )
    .eq("service_token", token)
    .single();

  if (!asset) notFound();

  const [{ data: issues }, { data: services }] = await Promise.all([
    supabase
      .from("issues")
      .select(
        "id, created_at, description, status, service_notes, reporter_phone, image_url",
      )
      .eq("asset_id", asset.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("services")
      .select(
        "id, serviced_at, next_service_at, type, performed_by, notes, cost, image_url",
      )
      .eq("asset_id", asset.id)
      .order("serviced_at", { ascending: false })
      .limit(10),
  ]);

  const statusConfig: Record<string, { label: string; className: string }> = {
    broken: { label: "Uszkodzona", className: "bg-red-100 text-red-700" },
    maintenance: {
      label: "W serwisie",
      className: "bg-yellow-100 text-yellow-700",
    },
    working: { label: "Sprawna", className: "bg-green-100 text-green-700" },
    closed: { label: "Zamknięta", className: "bg-gray-100 text-gray-500" },
  };
  const status = statusConfig[asset.status ?? ""] ?? statusConfig.working;

  return (
    <div className="min-h-dvh bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
          <ScanQrCode size={14} className="text-white" />
        </div>
        <span className="font-semibold text-sm text-gray-900">Asseto</span>
        <span className="text-gray-300 text-xs ml-1">· Panel serwisanta</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Karta maszyny */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex gap-4">
            {asset.image_url ? (
              <img
                src={asset.image_url}
                alt={asset.name}
                sizes="80px"
                className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                <ScanQrCode size={18} className="text-gray-300" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-base font-semibold text-gray-900">
                  {asset.name}
                </h1>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
              {asset.location && (
                <p className="text-xs text-gray-400 mt-0.5">
                  📍 {asset.location}
                </p>
              )}
              {asset.serial_number && (
                <p className="text-xs text-gray-400 mt-0.5">
                  S/N: {asset.serial_number}
                </p>
              )}
              {asset.reference_number && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Ref: {asset.reference_number}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Historia awarii */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Awarie ({issues?.length ?? 0})
          </h2>
          <ServiceIssueHistory
            issues={issues ?? []}
            assetId={asset.id}
            token={token}
          />
        </div>

        {/* Dodaj wpis serwisowy */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Dodaj wpis serwisowy
          </h2>
          <AddServiceEntryForm assetId={asset.id} token={token} />
        </div>

        {/* Historia serwisów */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Historia serwisów ({services?.length ?? 0})
          </h2>
          <ServiceHistory services={services ?? []} />
        </div>
      </div>
    </div>
  );
}
