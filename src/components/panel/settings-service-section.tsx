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
  defaultServicePhone?: string | null;
  defaultServiceEmail?: string | null;
}

export function ServiceSettings({
  userId,
  defaultServicePhone,
  defaultServiceEmail,
}: Props) {
  const [phone, setPhone] = useState(defaultServicePhone ?? "");
  const [email, setEmail] = useState(defaultServiceEmail ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        default_service_phone: phone || null,
        default_service_email: email || null,
      })
      .eq("id", userId);

    if (error) {
      toast.error("Nie udało się zapisać.");
    } else {
      toast.success("Zapisano dane serwisanta.");
    }

    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
        Domyślny serwisant
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Dane zostaną automatycznie uzupełnione dla nowych maszyn. Możesz je
        nadpisać per maszyna.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <div className="space-y-1.5">
          <Label htmlFor="service_phone">Telefon</Label>
          <Input
            id="service_phone"
            placeholder="np. 739907919"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="service_email">Email</Label>
          <Input
            id="service_email"
            type="email"
            placeholder="serwis@firma.pl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={handleSave} disabled={saving} className="mt-4">
        {saving ? (
          <>
            <Loader2 size={14} className="animate-spin mr-1.5" />
            Zapisywanie...
          </>
        ) : (
          "Zapisz"
        )}
      </Button>
    </div>
  );
}
