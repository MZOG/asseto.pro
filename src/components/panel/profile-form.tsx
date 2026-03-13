"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

    if (error) {
      toast.error("Nie udało się zapisać.");
    } else {
      toast.success("Profil zaktualizowany.");
    }

    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Imię i nazwisko</Label>
        <Input
          id="name"
          name="name"
          placeholder="Jan Kowalski"
          value={form.name}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="companyName">Nazwa firmy</Label>
        <Input
          id="companyName"
          name="companyName"
          placeholder="Firma Sp. z o.o."
          value={form.companyName}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Numer telefonu</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="np. 739907919"
          value={form.phone}
          onChange={handleChange}
        />
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? (
          <>
            <Loader2 size={14} className="animate-spin mr-1.5" />
            Zapisywanie...
          </>
        ) : (
          "Zapisz zmiany"
        )}
      </Button>
    </div>
  );
}
