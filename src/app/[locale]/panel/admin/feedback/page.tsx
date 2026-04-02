// src/app/[locale]/panel/admin/feedback/page.tsx
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/panel/page-header";
import { notFound } from "next/navigation";

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

export default async function AdminFeedbackPage() {
  const userId = (await headers()).get("x-user-id");
  if (userId !== ADMIN_ID) notFound();

  const supabase = await createClient();
  const { data: feedback } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <section>
      <PageHeader title="Admin — Feedback" />
      <div className="space-y-3 mt-4">
        {(feedback ?? []).length === 0 && (
          <p className="text-sm text-gray-400">Brak feedbacku.</p>
        )}
        {(feedback ?? []).map((f: any) => (
          <div
            key={f.id}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">
                {f.user_email ?? "Anonim"}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(f.created_at).toLocaleString("pl-PL")}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{f.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
