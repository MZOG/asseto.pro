"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

interface Props {
  userId: string | null;
  name: string;
  companyName: string;
  phone: string;
}

export default function ProfileForm({
  userId,
  name,
  companyName,
  phone,
}: Props) {
  const t = useTranslations("panel.profile.form");
  const [form, setForm] = useState({ name, companyName, phone });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.name || null,
        company_name: form.companyName || null,
        phone: form.phone || null,
      })
      .eq("id", userId);

    if (error) toast.error(t("errorSave"));
    else toast.success(t("successSave"));
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          name="name"
          placeholder={t("namePlaceholder")}
          value={form.name}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="companyName">{t("company")}</Label>
        <Input
          id="companyName"
          name="companyName"
          placeholder={t("companyPlaceholder")}
          value={form.companyName}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">{t("phone")}</Label>
        <Input
          id="phone"
          name="phone"
          placeholder={t("phonePlaceholder")}
          value={form.phone}
          onChange={handleChange}
        />
      </div>
      <Button onClick={handleSave} disabled={saving}>
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
  );
}
