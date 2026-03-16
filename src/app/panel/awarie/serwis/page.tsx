import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/panel/page-header";
import IssuesList from "@/components/panel/issues-list";

export default async function IssuesSerwisPage() {
  const userId = (await headers()).get("x-user-id");
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  return (
    <section>
      <PageHeader title="W serwisie" />
      <div className="mt-4">
        <IssuesList
          status="maintenance"
          isPro={profile?.plan === "pro"}
          userId={userId ?? ""}
        />
      </div>
    </section>
  );
}
