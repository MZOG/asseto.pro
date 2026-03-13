import PageHeader from "@/components/panel/page-header";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import IssueCard from "@/components/panel/issue-card";

export default async function IssuesPage() {
  const userId = (await headers()).get("x-user-id");
  const supabase = await createClient();
  const { data: issues, count } = await supabase
    .from("issues")
    .select(
      `
      *,
      assets!inner(name, owner_id)
    `,
      { count: "exact" },
    )
    .eq("status", "broken")
    .eq("assets.owner_id", userId)
    .order("created_at", { ascending: false });

  return (
    <section>
      <PageHeader title="Awarie" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
        {issues && issues?.length > 0 ? (
          issues?.map((issue) => <IssueCard key={issue.id} issue={issue} />)
        ) : (
          <p>Brak aktywnych awarii!</p>
        )}
      </div>
    </section>
  );
}
