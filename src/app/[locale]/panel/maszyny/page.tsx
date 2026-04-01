import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/panel/page-header";
import AssetsCard from "@/components/panel/assets-card";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProFeaturesModal } from "@/components/panel/pro-features-modal";
import { getPlanLimit } from "@/lib/utils/plan";
import { getTranslations } from "next-intl/server";

export default async function EquipmentPage() {
  const t = await getTranslations("panel.assetsPage");
  const supabase = await createClient();
  const userId = (await headers()).get("x-user-id");

  const [{ data: assets }, { data: profile }] = await Promise.all([
    supabase
      .from("assets")
      .select("*, issues(count)")
      .eq("owner_id", userId)
      .order("status", { ascending: true }),
    supabase.from("profiles").select("plan").eq("id", userId).single(),
  ]);

  const userPlan = profile?.plan ?? "free";
  const limit = getPlanLimit(userPlan);
  const atLimit = (assets?.length ?? 0) >= limit;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title={t("title")} className="mb-0" />
        {atLimit ? (
          <ProFeaturesModal text={t("addMore")} />
        ) : (
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/panel/maszyny/dodaj">
              <Plus size={14} />
              {t("add")}
            </Link>
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {assets?.map((asset) => (
          <AssetsCard key={asset.id} asset={asset} />
        ))}
      </div>
    </section>
  );
}
