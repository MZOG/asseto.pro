"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Upload, X } from "lucide-react";
import { QrCode } from "@/components/panel/qr-code";
import StatusBadge from "@/components/panel/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = [
  { value: "working", label: "Sprawna" },
  { value: "broken", label: "Uszkodzona" },
  { value: "maintenance", label: "W serwisie" },
  { value: "closed", label: "Zamknięta" },
];

export default function AssetInfoTab({
  asset,
  fields: initialFields,
  profile,
}: any) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(asset.image_url);
  const [fields, setFields] = useState(initialFields);
  const [newFields, setNewFields] = useState<
    { label: string; value: string }[]
  >([]);

  const [form, setForm] = useState({
    name: asset.name ?? "",
    serial_number: asset.serial_number ?? "",
    reference_number: asset.reference_number ?? "",
    location: asset.location ?? "",
    next_inspection_date: asset.next_inspection_date ?? "",
    status: asset.status ?? "working",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${asset.id}/main.${ext}`;
    await supabase.storage
      .from("asset-images")
      .upload(path, file, { upsert: true });
    const {
      data: { publicUrl },
    } = supabase.storage.from("asset-images").getPublicUrl(path);
    await supabase
      .from("assets")
      .update({ image_url: publicUrl + `?t=${Date.now()}` })
      .eq("id", asset.id);
    setImageUrl(publicUrl + `?t=${Date.now()}`);
    toast.success("Zdjęcie zaktualizowane.");
    setUploading(false);
  };

  const handleImageDelete = async () => {
    const supabase = createClient();
    const ext = imageUrl?.split(".").pop()?.split("?")[0];
    await supabase.storage
      .from("asset-images")
      .remove([`${asset.id}/main.${ext}`]);
    await supabase
      .from("assets")
      .update({ image_url: null })
      .eq("id", asset.id);
    setImageUrl(null);
    toast.success("Zdjęcie usunięte.");
  };

  const removeExistingField = async (fieldId: number) => {
    const supabase = createClient();
    await supabase.from("asset_fields").delete().eq("id", fieldId);
    setFields((prev: any[]) => prev.filter((f: any) => f.id !== fieldId));
    toast.success("Pole usunięte.");
  };

  const updateExistingField = (
    id: number,
    key: "label" | "value",
    value: string,
  ) => {
    setFields((prev: any[]) =>
      prev.map((f: any) => (f.id === id ? { ...f, [key]: value } : f)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    await supabase
      .from("assets")
      .update({
        name: form.name,
        serial_number: form.serial_number || null,
        reference_number: form.reference_number || null,
        location: form.location || null,
        next_inspection_date: form.next_inspection_date || null,
        status: form.status,
      })
      .eq("id", asset.id);

    const fieldUpdates = fields.map((f: any) =>
      supabase
        .from("asset_fields")
        .update({ label: f.label, value: f.value })
        .eq("id", f.id),
    );
    const validNewFields = newFields.filter(
      (f) => f.label.trim() && f.value.trim(),
    );
    if (validNewFields.length > 0) {
      await supabase
        .from("asset_fields")
        .insert(
          validNewFields.map((f) => ({
            asset_id: asset.id,
            label: f.label,
            value: f.value,
          })),
        );
      setNewFields([]);
    }
    await Promise.all(fieldUpdates);

    toast.success("Zapisano zmiany.");
    router.refresh();
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Zdjęcie */}
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Zdjęcie
        </h2>
        <div className="flex items-center gap-4">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={form.name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200 shrink-0"
              />
              <div className="flex flex-col gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  disabled={uploading}
                >
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {uploading ? (
                      <Loader2 size={14} className="animate-spin mr-1.5" />
                    ) : (
                      <Upload size={14} className="mr-1.5" />
                    )}
                    Zmień zdjęcie
                  </label>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleImageDelete}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={14} className="mr-1.5" />
                  Usuń zdjęcie
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                <Upload size={20} className="text-gray-400" />
              </div>
              <Button variant="outline" size="sm" asChild disabled={uploading}>
                <label htmlFor="image-upload" className="cursor-pointer">
                  {uploading ? (
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                  ) : (
                    <Upload size={14} className="mr-1.5" />
                  )}
                  Dodaj zdjęcie
                </label>
              </Button>
            </>
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </div>
      </div>

      <Separator />

      {/* Informacje */}
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Informacje
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nazwa maszyny</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((prev) => ({ ...prev, status: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Lokalizacja</Label>
            <Input
              id="location"
              name="location"
              placeholder="np. Hala A, stanowisko 3"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="serial_number">Numer seryjny</Label>
            <Input
              id="serial_number"
              name="serial_number"
              value={form.serial_number}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reference_number">Numer referencyjny</Label>
            <Input
              id="reference_number"
              name="reference_number"
              value={form.reference_number}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="next_inspection_date">
              Data następnego przeglądu
            </Label>
            <Input
              id="next_inspection_date"
              name="next_inspection_date"
              type="date"
              value={form.next_inspection_date}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Własne pola */}
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Własne pola
        </h2>
        {fields.map((field: any) => (
          <div key={field.id} className="flex items-center gap-2 mb-2">
            <Input
              value={field.label}
              onChange={(e) =>
                updateExistingField(field.id, "label", e.target.value)
              }
              className="max-w-[140px]"
            />
            <Input
              value={field.value}
              onChange={(e) =>
                updateExistingField(field.id, "value", e.target.value)
              }
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeExistingField(field.id)}
              className="text-gray-400 hover:text-red-500 shrink-0"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        ))}
        {newFields.map((field, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <Input
              placeholder="Nazwa"
              value={field.label}
              onChange={(e) =>
                setNewFields((prev) =>
                  prev.map((f, idx) =>
                    idx === i ? { ...f, label: e.target.value } : f,
                  ),
                )
              }
              className="max-w-[140px]"
            />
            <Input
              placeholder="Wartość"
              value={field.value}
              onChange={(e) =>
                setNewFields((prev) =>
                  prev.map((f, idx) =>
                    idx === i ? { ...f, value: e.target.value } : f,
                  ),
                )
              }
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setNewFields((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="text-gray-400 hover:text-red-500 shrink-0"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setNewFields((prev) => [...prev, { label: "", value: "" }])
          }
          className="mt-1"
        >
          <Plus size={14} className="mr-1.5" />
          Dodaj pole
        </Button>
      </div>

      <Separator />

      {/* Kod QR */}
      <div>
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

      <Separator />

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {saving ? (
          <>
            <Loader2 size={15} className="animate-spin mr-2" />
            Zapisywanie...
          </>
        ) : (
          "Zapisz zmiany"
        )}
      </Button>
    </div>
  );
}
