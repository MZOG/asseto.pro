import PageHeader from "@/components/panel/page-header";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import IssueCard from "@/components/panel/issue-card";

export default async function IssuesZamknietePage() {
  const userId = (await headers()).get("x-user-id");
  const supabase = await createClient();
  const { data: issues } = await supabase
    .from("issues")
    .select(`*, assets!inner(name, owner_id)`)
    .eq("assets.owner_id", userId)
    .eq("status", "closed")
    .order("created_at", { ascending: false });

  return (
    <section>
      <PageHeader title="Zamknięte" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
        {issues && issues?.length > 0 ? (
          issues?.map((issue) => <IssueCard key={issue.id} issue={issue} />)
        ) : (
          <div className="p-5 border max-w-xs rounded-md">
            <p>Brak maszyn.</p>
          </div>
        )}
      </div>
    </section>
  );
}
