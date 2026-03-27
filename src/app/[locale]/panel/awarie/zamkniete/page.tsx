import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/panel/page-header";
import IssuesList from "@/components/panel/issues-list";
import { isPro } from "@/lib/utils/plan";

export default async function IssuesZamknietePage() {
  const userId = (await headers()).get("x-user-id");
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  return (
    <section>
      <PageHeader title="Zamknięte" />
      <div className="mt-4">
        <IssuesList
          status="closed"
          isPro={isPro(profile?.plan ?? "free")}
          userId={userId ?? ""}
        />
      </div>
    </section>
  );
}
