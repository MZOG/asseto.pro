// src/app/panel/awarie/[id]/page.tsx
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PageHeader from "@/components/panel/page-header";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Hash,
  MapPin,
  Phone,
  Mail,
  ScanQrCode,
} from "lucide-react";
import Link from "next/link";
import IssueStatusSelect from "@/components/panel/issue-status-select";
import NotifyServiceButton from "@/components/panel/notify-service-button";
import { Separator } from "@/components/ui/separator";
import PrioritySelect from "@/components/panel/awarie/priority-select";

export default async function IssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = (await headers()).get("x-user-id");
  const supabase = await createClient();

  const { data: issue } = await supabase
    .from("issues")
    .select(
      `
      *,
      assets!inner(
        id, name, serial_number, reference_number,
        location, image_url, service_phone, service_email,
        owner_id, service_token,
        profiles!inner(company_name, plan, default_service_email)
      )
    `,
    )
    .eq("id", id)
    .eq("assets.owner_id", userId)
    .single();

  if (!issue) notFound();

  const asset = issue.assets;
  const profile = asset.profiles;

  return (
    <section className="max-w-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <PageHeader title={`Awaria #${issue.id}`} className="mb-5 md:mb-0" />
        <div className="flex items-center gap-2">
          <div>
            <p className="text-xs mb-1">Priorytet</p>
            <PrioritySelect
              issueId={issue.id}
              currentPriority={issue.priority}
            />
          </div>
          <div>
            <p className="text-xs mb-1">Status</p>
            <IssueStatusSelect
              issueId={issue.id}
              currentStatus={issue.status}
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Opis */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Opis usterki
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {issue.description ?? (
              <span className="text-gray-400 italic">Brak opisu</span>
            )}
          </p>
        </div>

        {/* Zdjęcie */}
        {issue.image_url && (
          <div className="mt-4">
            <img
              src={issue.image_url}
              alt="Zdjęcie usterki"
              className="w-full max-h-72 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}

        {/* Daty */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Szczegóły
          </h2>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm">
              <Calendar size={14} className="text-gray-400 shrink-0" />
              <span className="text-gray-500">Zgłoszono:</span>
              <span className="text-gray-700 font-medium">
                {formatDate(issue.created_at)}
              </span>
            </div>

            {issue.updated_at && (
              <div className="flex items-center gap-2.5 text-sm">
                <Clock size={14} className="text-gray-400 shrink-0" />
                <span className="text-gray-500">Zaktualizowano:</span>
                <span className="text-gray-700 font-medium">
                  {formatDate(issue.updated_at)}
                </span>
              </div>
            )}
            {issue.closed_at && (
              <div className="flex items-center gap-2.5 text-sm">
                <Clock size={14} className="text-gray-400 shrink-0" />
                <span className="text-gray-500">Zamknięto:</span>
                <span className="text-gray-700 font-medium">
                  {formatDate(issue.closed_at)}
                </span>
              </div>
            )}

            <Separator />

            {issue.reporter_phone && (
              <div className="flex items-center gap-2.5 text-sm">
                <Phone size={14} className="text-gray-400 shrink-0" />
                <span className="text-gray-500">Telefon zgłaszającego:</span>
                <a
                  href={`tel:${issue.reporter_phone}`}
                  className="text-gray-700 font-medium hover:underline underline-offset-2"
                >
                  {issue.reporter_phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Maszyna */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Maszyna
            </h2>
            <Link
              href={`/panel/maszyny/${asset.id}`}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Zobacz maszynę →
            </Link>
          </div>

          <div className="flex gap-4">
            {/* Zdjęcie */}
            {asset.image_url ? (
              <img
                src={asset.image_url}
                alt={asset.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                <ScanQrCode size={20} className="text-gray-300" />
              </div>
            )}

            {/* Dane */}
            <div className="space-y-2 flex-1">
              <p className="text-gray-900 font-semibold text-sm">
                {asset.name}
              </p>

              {asset.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={13} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600">{asset.location}</span>
                </div>
              )}
              {asset.serial_number && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash size={13} className="text-gray-400 shrink-0" />
                  <span className="text-gray-500">S/N:</span>
                  <span className="text-gray-600 font-mono">
                    {asset.serial_number}
                  </span>
                </div>
              )}
              {asset.reference_number && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash size={13} className="text-gray-400 shrink-0" />
                  <span className="text-gray-500">Ref:</span>
                  <span className="text-gray-600 font-mono">
                    {asset.reference_number}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Serwisant */}
          {(asset.service_phone || asset.service_email) && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Serwisant
              </p>
              {asset.service_phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={13} className="text-gray-400 shrink-0" />
                  <a
                    href={`tel:${asset.service_phone}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {asset.service_phone}
                  </a>
                </div>
              )}
              {asset.service_email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={13} className="text-gray-400 shrink-0" />
                  <a
                    href={`mailto:${asset.service_email}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {asset.service_email}
                  </a>
                </div>
              )}
            </div>
          )}

          <NotifyServiceButton
            issueId={issue.id}
            assetName={asset.name}
            description={issue.description}
            createdAt={issue.created_at}
            companyName={profile?.company_name}
            serviceEmail={asset.service_email ?? profile?.default_service_email}
            isPro={profile?.plan === "pro"}
            serviceToken={asset.service_token}
          />
        </div>
      </div>
    </section>
  );
}
