"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Phone, Mail } from "lucide-react";
import ServiceTokenSection from "../serwisExternal/service-token-section";
import AddServiceForm from "../serwis/add-service-form";
import ServiceHistory from "../serwis/service-history";
import { useTranslations } from "next-intl";

export default function AssetServiceTab({
  asset,
  profile,
  services,
  isPro,
}: any) {
  const t = useTranslations("panel.assetService");
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    service_phone: asset.service_phone ?? profile?.default_service_phone ?? "",
    service_email: asset.service_email ?? profile?.default_service_email ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("assets")
      .update({
        service_phone: form.service_phone || null,
        service_email: form.service_email || null,
      })
      .eq("id", asset.id);

    if (error) toast.error(t("error"));
    else {
      toast.success(t("saved"));
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          {t("technicianData")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="service_phone">{t("phone")}</Label>
            <div className="relative">
              <Phone
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                id="service_phone"
                name="service_phone"
                placeholder={t("phonePlaceholder")}
                value={form.service_phone}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="service_email">{t("email")}</Label>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                id="service_email"
                name="service_email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={form.service_email}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin mr-1.5" />
              {t("saving")}
            </>
          ) : (
            t("save")
          )}
        </Button>
      </div>

      {isPro && (
        <>
          <Separator />
          <ServiceTokenSection
            assetId={asset.id}
            serviceToken={asset.service_token}
          />
        </>
      )}

      <Separator />

      {isPro && (
        <>
          <div>
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
              {t("addService")}
            </h2>
            <AddServiceForm assetId={asset.id} />
          </div>
          <Separator />
        </>
      )}

      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          {t("serviceHistory")}
        </h2>
        <ServiceHistory services={services} assetId={asset.id} />
      </div>
    </div>
  );
}
