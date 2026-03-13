"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { printSizes } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface QrSettingsProps {
  userId: string | null;
  defaultLabelTop?: string | null;
  defaultLabelBottom?: string | null;
  defaultPrintSize?: string | null;
}

export function QrSettings({
  userId,
  defaultLabelTop,
  defaultLabelBottom,
  defaultPrintSize,
}: QrSettingsProps) {
  const [labelTop, setLabelTop] = useState(defaultLabelTop ?? "Zgłoś usterkę");
  const [labelBottom, setLabelBottom] = useState(
    defaultLabelBottom ?? "Zeskanuj kod QR",
  );
  const [printSize, setPrintSize] = useState(defaultPrintSize ?? "A6");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        qr_label_top: labelTop,
        qr_label_bottom: labelBottom,
        qr_print_size: printSize,
      })
      .eq("id", userId);

    if (error) {
      toast.error("Nie udało się zapisać.");
    } else {
      toast.success("Ustawienia QR zapisane!");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="qr_top">Tekst nad kodem QR</Label>
        <Input
          id="qr_top"
          placeholder="np. Zgłoś usterkę"
          value={labelTop}
          onChange={(e) => setLabelTop(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="qr_bottom">Tekst pod kodem QR</Label>
        <Input
          id="qr_bottom"
          placeholder="np. Zeskanuj kod QR"
          value={labelBottom}
          onChange={(e) => setLabelBottom(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Domyślny rozmiar wydruku</Label>
        <Select
          defaultValue={defaultPrintSize ?? "A6"}
          onValueChange={setPrintSize}
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {printSizes.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Zapisywanie..." : "Zapisz"}
      </Button>
    </div>
  );
}
