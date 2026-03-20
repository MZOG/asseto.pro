"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const serviceTypes = [
  { value: "inspection", label: "Przegląd" },
  { value: "repair", label: "Naprawa" },
  { value: "replacement", label: "Wymiana części" },
];

export default function AddServiceEntryForm({
  assetId,
  token,
}: {
  assetId: string;
  token: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    serviced_at: new Date().toISOString().split("T")[0],
    next_service_at: "",
    type: "inspection",
    performed_by: "",
    cost: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.serviced_at) {
      toast.error("Data serwisu jest wymagana.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    // Weryfikuj token
    const { data: asset } = await supabase
      .from("assets")
      .select("id")
      .eq("service_token", token)
      .eq("id", assetId)
      .single();

    if (!asset) {
      toast.error("Nieprawidłowy token.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("services").insert({
      asset_id: assetId,
      serviced_at: form.serviced_at,
      next_service_at: form.next_service_at || null,
      type: form.type,
      performed_by: form.performed_by || null,
      cost: form.cost ? parseFloat(form.cost) : null,
      notes: form.notes || null,
    });

    if (error) {
      toast.error("Nie udało się zapisać.");
      setSaving(false);
      return;
    }

    toast.success("Wpis serwisowy dodany.");
    setForm({
      serviced_at: new Date().toISOString().split("T")[0],
      next_service_at: "",
      type: "inspection",
      performed_by: "",
      cost: "",
      notes: "",
    });
    router.refresh();
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="serviced_at" className="text-xs">
            Data serwisu *
          </Label>
          <Input
            id="serviced_at"
            name="serviced_at"
            type="date"
            value={form.serviced_at}
            onChange={handleChange}
            className="text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="next_service_at" className="text-xs">
            Następny serwis
          </Label>
          <Input
            id="next_service_at"
            name="next_service_at"
            type="date"
            value={form.next_service_at}
            onChange={handleChange}
            className="text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Typ serwisu</Label>
          <Select
            value={form.type}
            onValueChange={(v) => setForm((prev) => ({ ...prev, type: v }))}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="performed_by" className="text-xs">
            Wykonał
          </Label>
          <Input
            id="performed_by"
            name="performed_by"
            placeholder="Imię, firma..."
            value={form.performed_by}
            onChange={handleChange}
            className="text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cost" className="text-xs">
          Koszt (zł)
        </Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          placeholder="np. 350"
          value={form.cost}
          onChange={handleChange}
          className="text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-xs">
          Notatki
        </Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Co zostało zrobione..."
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="resize-none text-sm"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {saving ? (
          <>
            <Loader2 size={13} className="animate-spin mr-1.5" />
            Zapisywanie...
          </>
        ) : (
          "Dodaj wpis serwisowy"
        )}
      </Button>
    </div>
  );
}
