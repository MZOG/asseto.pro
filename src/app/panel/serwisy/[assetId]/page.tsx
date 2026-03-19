// src/app/panel/serwisy/[assetId]/page.tsx
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PageHeader from "@/components/panel/page-header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddServiceForm from "@/components/panel/serwis/add-service-form";
import ServiceHistory from "@/components/panel/serwis/service-history";

export default async function AssetSerwisyPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const userId = (await headers()).get("x-user-id");
  const supabase = await createClient();

  const { data: asset } = await supabase
    .from("assets")
    .select("id, name, location")
    .eq("id", assetId)
    .eq("owner_id", userId)
    .single();

  if (!asset) notFound();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("asset_id", assetId)
    .order("serviced_at", { ascending: false });

  return (
    <section className="max-w-2xl">
      <Link
        href="/panel/serwisy"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft size={13} /> Wróć do serwisów
      </Link>

      <PageHeader title={asset.name} />
      {asset.location && (
        <p className="text-sm text-gray-400 -mt-4 mb-6">{asset.location}</p>
      )}

      {/* Dodaj nowy serwis */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          Dodaj wpis serwisowy
        </h2>
        <AddServiceForm assetId={asset.id} />
      </div>

      {/* Historia */}
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Historia serwisów
        </h2>
        <ServiceHistory services={services ?? []} assetId={asset.id} />
      </div>
    </section>
  );
}
