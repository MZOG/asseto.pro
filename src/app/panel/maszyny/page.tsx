import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/panel/page-header";
import AddEquipmentButton from "@/components/panel/add-equipment-button";
import AssetsCard from "@/components/panel/assets-card";

export default async function EquipmentPage() {
  const supabase = await createClient();
  // pobieramy użytkownika
  const userId = (await headers()).get("x-user-id");

  const { data: assets } = await supabase
    .from("assets")
    .select("*, issues(count)")
    .eq("owner_id", userId)
    .order("status", { ascending: true });

  return (
    <section>
      <PageHeader title="Maszyny" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {assets?.map((asset) => {
          return <AssetsCard key={asset.id} asset={asset} />;
        })}
      </div>

      <AddEquipmentButton />
    </section>
  );
}
