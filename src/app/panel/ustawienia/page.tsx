import { headers } from "next/headers";
import PageHeader from "@/components/panel/page-header";
import { QrSettings } from "@/components/panel/settings-qr-section";
import { createClient } from "@/lib/supabase/server";
import { Separator } from "@/components/ui/separator";
import SubscriptionSection from "@/components/panel/subscription-panel";
import { ServiceSettings } from "@/components/panel/settings-service-section";
import { ReportsSettings } from "@/components/panel/ustawienia/reports-section";

export default async function SettingsPage() {
  const userId = (await headers()).get("x-user-id");

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  const { qr_label_top, qr_label_bottom, plan } = data;

  return (
    <section>
      <PageHeader title="Ustawienia" />
      <SubscriptionSection
        plan={data?.plan ?? "free"}
        subscriptionStatus={data?.subscription_status}
        subscriptionEndsAt={data?.subscription_ends_at}
      />
      <Separator className="my-5" />

      <QrSettings
        userId={userId}
        defaultLabelTop={qr_label_top}
        defaultLabelBottom={qr_label_bottom}
        defaultPrintSize={data?.qr_print_size}
        isPro={plan === "pro"}
      />
      <Separator className="my-5" />

      <ServiceSettings
        userId={userId}
        defaultServicePhone={data?.default_service_phone}
        defaultServiceEmail={data?.default_service_email}
      />

      <Separator className="my-5" />
      <ReportsSettings
        userId={userId}
        reportIssues={data?.report_issues ?? true}
        reportServices={data?.report_services ?? true}
        isPro={data?.plan === "pro"}
      />
    </section>
  );
}
