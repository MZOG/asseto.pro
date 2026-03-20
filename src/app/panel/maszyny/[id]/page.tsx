import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QrCode } from "@/components/panel/qr-code";
import AssetEditForm from "@/components/panel/asset-edit-form";
import AssetIssueHistory from "@/components/panel/asset-issue-history";
import AssetDeleteButton from "@/components/panel/asset-delete-button";
import PageHeader from "@/components/panel/page-header";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serviceTypeConfig } from "@/lib/utils/service";
import ServiceTokenSection from "@/components/panel/serwisExternal/service-token-section";

export default async function MaszynaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = (await headers()).get("x-user-id");

  const supabase = await createClient();

  const [
    { data: asset },
    { data: profile },
    { data: fields },
    { data: issues },
    { data: services },
  ] = await Promise.all([
    supabase
      .from("assets")
      .select("*")
      .eq("id", id)
      .eq("owner_id", userId)
      .single(),
    supabase
      .from("profiles")
      .select(
        "qr_label_top, qr_label_bottom, qr_print_size, default_service_phone, default_service_email, plan",
      )
      .eq("id", userId)
      .single(),
    supabase
      .from("asset_fields")
      .select("*")
      .eq("asset_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("issues")
      .select("id, created_at, description, status")
      .eq("asset_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("services")
      .select("id, serviced_at, next_service_at, type, performed_by")
      .eq("asset_id", id)
      .order("serviced_at", { ascending: false })
      .limit(3),
  ]);

  if (!asset) notFound();

  const isPro = profile?.plan === "pro";

  const lastService = services?.[0] ?? null;
  const nextService =
    services
      ?.filter((s) => s.next_service_at)
      .sort(
        (a, b) =>
          new Date(a.next_service_at).getTime() -
          new Date(b.next_service_at).getTime(),
      )[0] ?? null;

  return (
    <section className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader title={asset.name} />
        <AssetDeleteButton assetId={asset.id} />
      </div>

      {/* Formularz edycji */}
      <AssetEditForm
        asset={asset}
        fields={fields ?? []}
        defaultServicePhone={profile?.default_service_phone}
        defaultServiceEmail={profile?.default_service_email}
      />

      {/* Kod QR */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          Kod QR
        </h2>
        <QrCode
          assetId={asset.id}
          assetName={asset.name}
          labelTop={profile?.qr_label_top}
          labelBottom={profile?.qr_label_bottom}
          printSize={asset.qr_print_size}
          defaultPrintSize={profile?.qr_print_size ?? "S"}
        />
      </div>

      {/* Serwisy */}
      {isPro && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Serwisy
            </h2>
            <Link href={`/panel/serwisy/${asset.id}`}>
              <Button variant="outline" size="sm">
                <Plus size={13} className="mr-1.5" />
                Dodaj wpis
              </Button>
            </Link>
          </div>

          {!services?.length ? (
            <p className="text-sm text-gray-400">Brak wpisów serwisowych.</p>
          ) : (
            <div className="space-y-3">
              {lastService && (
                <div className="flex items-start justify-between text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      Ostatni serwis
                    </p>
                    <p className="font-medium text-gray-900">
                      {new Date(lastService.serviced_at).toLocaleDateString(
                        "pl-PL",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                    {(() => {
                      const config =
                        serviceTypeConfig[
                          lastService.type as keyof typeof serviceTypeConfig
                        ] ?? serviceTypeConfig.inspection;
                      const Icon = config.icon;
                      return (
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${config.className}`}
                          >
                            <Icon size={11} />
                            {config.label}
                          </span>
                          {lastService.performed_by && (
                            <span className="text-xs text-gray-400">
                              {lastService.performed_by}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {nextService && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0.5">
                        Następny serwis
                      </p>
                      <p className="font-medium text-gray-900">
                        {new Date(
                          nextService.next_service_at,
                        ).toLocaleDateString("pl-PL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Link
                href={`/panel/serwisy/${asset.id}`}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium block"
              >
                Zobacz pełną historię serwisów →
              </Link>
            </div>
          )}
        </div>
      )}

      {isPro && (
        <ServiceTokenSection
          assetId={asset.id}
          serviceToken={asset.service_token}
        />
      )}

      {/* Historia awarii */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          Historia awarii
        </h2>
        <AssetIssueHistory issues={issues ?? []} />
      </div>
    </section>
  );
}
