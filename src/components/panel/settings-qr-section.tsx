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
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useUpgrade } from "@/hooks/use-upgrade";
import { ProFeaturesModal } from "./pro-features-modal";

interface QrSettingsProps {
  userId: string | null;
  defaultLabelTop?: string | null;
  defaultLabelBottom?: string | null;
  defaultPrintSize?: string | null;
  isPro: boolean;
}

export function QrSettings({
  userId,
  defaultLabelTop,
  defaultLabelBottom,
  defaultPrintSize,
  isPro,
}: QrSettingsProps) {
  const [labelTop, setLabelTop] = useState(defaultLabelTop ?? "Zgłoś usterkę");
  const [labelBottom, setLabelBottom] = useState(
    defaultLabelBottom ?? "Zeskanuj kod QR",
  );
  const [printSize, setPrintSize] = useState(defaultPrintSize ?? "A6");
  const [saving, setSaving] = useState(false);
  const { upgrade, loading } = useUpgrade();

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    const updates: Record<string, unknown> = {
      qr_print_size: printSize,
    };

    // Etykiety tylko dla Pro
    if (isPro) {
      updates.qr_label_top = labelTop || null;
      updates.qr_label_bottom = labelBottom || null;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      toast.error("Nie udało się zapisać.");
    } else {
      toast.success("Zapisano.");
    }

    setSaving(false);
  };

  return (
    <div className="space-y-4">
      {!isPro && (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
          <Lock size={13} className="text-gray-400 shrink-0" />
          <p className="text-xs text-gray-500 flex-1">
            Edycja etykiet dostępna w planie Pro.
          </p>

          <ProFeaturesModal>
            <Button variant="default">
              <Lock size={14} />
              Odblokuj w planie Pro
            </Button>
          </ProFeaturesModal>
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="qr_top">Tekst nad kodem QR</Label>
        <Input
          id="qr_top"
          placeholder="np. Zgłoś usterkę"
          value={labelTop}
          onChange={(e) => setLabelTop(e.target.value)}
          className="max-w-xs"
          disabled={!isPro}
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
          disabled={!isPro}
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
      {/* <Button onClick={handleSave} disabled={saving}>
        {saving ? "Zapisywanie..." : "Zapisz"}
      </Button> */}

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
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
