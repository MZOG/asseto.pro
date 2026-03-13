import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QrCode } from "@/components/panel/qr-code";
import AssetEditForm from "@/components/panel/asset-edit-form";
import AssetIssueHistory from "@/components/panel/asset-issue-history";
import AssetDeleteButton from "@/components/panel/asset-delete-button";
import PageHeader from "@/components/panel/page-header";

export default async function MaszynaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = (await headers()).get("x-user-id");

  const supabase = await createClient();

  const [
    { data: asset },
    { data: profile },
    { data: fields },
    { data: issues },
  ] = await Promise.all([
    supabase
      .from("assets")
      .select("*")
      .eq("id", id)
      .eq("owner_id", userId)
      .single(),

    supabase
      .from("profiles")
      .select(
        "qr_label_top, qr_label_bottom, qr_print_size, default_service_phone, default_service_email",
      )
      .eq("id", userId)
      .single(),

    supabase
      .from("asset_fields")
      .select("*")
      .eq("asset_id", id)
      .order("created_at", { ascending: true }),

    supabase
      .from("issues")
      .select("id, created_at, description, status")
      .eq("asset_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (!asset) notFound();

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <PageHeader title={asset.name} />
        <AssetDeleteButton assetId={asset.id} />
      </div>

      {/* Grid — lewa kolumna: formularz, prawa: QR + historia */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Lewa — formularz edycji */}
        <AssetEditForm
          asset={asset}
          fields={fields ?? []}
          defaultServicePhone={profile?.default_service_phone}
          defaultServiceEmail={profile?.default_service_email}
        />

        {/* Prawa — QR + historia */}
        <div className="space-y-6">
          {/* Kod QR */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
              Kod QR
            </h2>
            <QrCode
              assetId={asset.id}
              assetName={asset.name}
              labelTop={profile?.qr_label_top}
              labelBottom={profile?.qr_label_bottom}
              printSize={asset.qr_print_size}
              defaultPrintSize={profile?.qr_print_size ?? "S"}
            />
          </div>

          {/* Historia awarii */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
              Historia awarii
            </h2>
            <AssetIssueHistory issues={issues ?? []} />
          </div>
        </div>
      </div>
    </section>
  );
}
