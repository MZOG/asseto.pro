import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/panel/page-header";
import IssuesList from "@/components/panel/issues-list";
import { isPro } from "@/lib/utils/plan";
import { getTranslations } from "next-intl/server";

export default async function IssuesSerwisPage() {
  const t = await getTranslations("panel");
  const userId = (await headers()).get("x-user-id");
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  return (
    <section>
      <PageHeader title={t("inService")} />
      <div className="mt-4">
        <IssuesList
          status="maintenance"
          isPro={isPro(profile?.plan ?? "free")}
          userId={userId ?? ""}
        />
      </div>
    </section>
  );
}
