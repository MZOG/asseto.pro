// src/app/panel/maszyny/[id]/page.tsx
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PageHeader from "@/components/panel/page-header";
import AssetDeleteButton from "@/components/panel/asset-delete-button";
import AssetTabs from "@/components/panel/maszyny/asset-tabs";
import { isPro } from "@/lib/utils/plan";

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
    { data: services },
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
        "qr_label_top, qr_label_bottom, qr_print_size, default_service_phone, default_service_email, plan",
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
      .select("id, created_at, description, status, priority")
      .eq("asset_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("services")
      .select(
        "id, serviced_at, next_service_at, type, performed_by, notes, cost, image_url",
      )
      .eq("asset_id", id)
      .order("serviced_at", { ascending: false }),
  ]);

  if (!asset) notFound();

  return (
    <section className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title={asset.name} className="mb-0" />
        <AssetDeleteButton assetId={asset.id} />
      </div>

      <AssetTabs
        asset={asset}
        profile={profile}
        fields={fields ?? []}
        issues={issues ?? []}
        services={services ?? []}
        isPro={isPro(profile?.plan ?? "free")}
      />
    </section>
  );
}
