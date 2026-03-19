"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const serviceTypes = [
  { value: "inspection", label: "Przegląd" },
  { value: "repair", label: "Naprawa" },
  { value: "replacement", label: "Wymiana części" },
];

export default function AddServiceForm({ assetId }: { assetId: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.serviced_at) {
      toast.error("Data serwisu jest wymagana.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    let imageUrl: string | null = null;
    if (image) {
      const ext = image.name.split(".").pop();
      const path = `services/${assetId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("asset-images")
        .upload(path, image, { upsert: false });

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("asset-images").getPublicUrl(path);
        imageUrl = publicUrl;
      }
    }

    const { error } = await supabase.from("services").insert({
      asset_id: assetId,
      serviced_at: form.serviced_at,
      next_service_at: form.next_service_at || null,
      type: form.type,
      performed_by: form.performed_by || null,
      cost: form.cost ? parseFloat(form.cost) : null,
      notes: form.notes || null,
      image_url: imageUrl,
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
    setImage(null);
    setImagePreview(null);
    router.refresh();
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="serviced_at">Data serwisu *</Label>
          <Input
            id="serviced_at"
            name="serviced_at"
            type="date"
            value={form.serviced_at}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="next_service_at">Następny serwis</Label>
          <Input
            id="next_service_at"
            name="next_service_at"
            type="date"
            value={form.next_service_at}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Typ serwisu</Label>
          <Select
            value={form.type}
            onValueChange={(v) => setForm((prev) => ({ ...prev, type: v }))}
          >
            <SelectTrigger>
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
          <Label htmlFor="performed_by">Wykonał</Label>
          <Input
            id="performed_by"
            name="performed_by"
            placeholder="Imię, firma serwisowa..."
            value={form.performed_by}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cost">Koszt (zł)</Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          placeholder="np. 350"
          value={form.cost}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notatki</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Co zostało zrobione, wymienione części, uwagi..."
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Zdjęcie */}
      <div className="space-y-1.5">
        <Label>
          Zdjęcie{" "}
          <span className="text-gray-400 font-normal">(opcjonalnie)</span>
        </Label>
        {imagePreview ? (
          <div className="relative w-full">
            <img
              src={imagePreview}
              alt="Podgląd"
              className="w-full max-h-40 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setImagePreview(null);
              }}
              className="absolute top-2 right-2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50"
            >
              <X size={13} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="service-image"
            className="flex items-center gap-2 border border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
          >
            <Upload size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              Dodaj zdjęcie z serwisu
            </span>
          </label>
        )}
        <input
          id="service-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {saving ? (
          <>
            <Loader2 size={14} className="animate-spin mr-1.5" />
            Zapisywanie...
          </>
        ) : (
          "Dodaj wpis serwisowy"
        )}
      </Button>
    </div>
  );
}
