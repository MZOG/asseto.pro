import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/panel/page-header";
import ProfileForm from "@/components/panel/profile-form";
import ResetPasswordButton from "@/components/panel/reset-password-button";
import { getTranslations } from "next-intl/server";

export default async function ProfilPage() {
  const t = await getTranslations("panel.profile");
  const userId = (await headers()).get("x-user-id");
  const userEmail = (await headers()).get("x-user-email");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, company_name, phone")
    .eq("id", userId)
    .single();

  return (
    <section className="max-w-lg">
      <PageHeader title={t("title")} />

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          {t("account")}
        </p>
        <p className="text-xs text-gray-400 mb-1">{t("emailLabel")}</p>
        <p className="text-sm text-gray-700 font-medium">{userEmail}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          {t("data")}
        </p>
        <ProfileForm
          userId={userId}
          name={profile?.name ?? ""}
          companyName={profile?.company_name ?? ""}
          phone={profile?.phone ?? ""}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          {t("password")}
        </p>
        <p className="text-xs text-gray-400 mb-4">
          {t("passwordDesc", { email: userEmail ?? "" })}
        </p>
        <ResetPasswordButton email={userEmail ?? ""} />
      </div>
    </section>
  );
}
