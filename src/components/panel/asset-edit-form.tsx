"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Loader2,
  Upload,
  CheckCircle2,
  Wrench,
  TriangleAlert,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AssetField {
  id: number;
  label: string;
  value: string;
}

interface Asset {
  id: number;
  name: string;
  serial_number: string | null;
  reference_number: string | null;
  service_phone: string | null;
  service_email: string | null;
  location: string | null;
  next_inspection_date: string | null;
  notes: string | null;
  image_url: string | null;
  status: string | null;
}

interface Props {
  asset: Asset;
  fields: AssetField[];
  defaultServicePhone?: string | null;
  defaultServiceEmail?: string | null;
}

export default function AssetEditForm({
  asset,
  fields: initialFields,
  defaultServicePhone,
  defaultServiceEmail,
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(asset.image_url);
  const [status, setStatus] = useState(asset.status ?? "working");

  const [form, setForm] = useState({
    name: asset.name ?? "",
    serial_number: asset.serial_number ?? "",
    reference_number: asset.reference_number ?? "",
    service_phone: asset.service_phone ?? defaultServicePhone ?? "",
    service_email: asset.service_email ?? defaultServiceEmail ?? "",
    location: asset.location ?? "",
    next_inspection_date: asset.next_inspection_date ?? "",
    notes: asset.notes ?? "",
  });

  const [fields, setFields] = useState<AssetField[]>(initialFields);
  const [newFields, setNewFields] = useState<
    { label: string; value: string }[]
  >([]);

  const updateExistingField = (
    id: number,
    key: "label" | "value",
    value: string,
  ) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)),
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addNewField = () => {
    setNewFields((prev) => [...prev, { label: "", value: "" }]);
  };

  const updateNewField = (
    index: number,
    key: "label" | "value",
    value: string,
  ) => {
    setNewFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [key]: value } : f)),
    );
  };

  const removeNewField = (index: number) => {
    setNewFields((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingField = async (fieldId: number) => {
    const supabase = createClient();
    await supabase.from("asset_fields").delete().eq("id", fieldId);
    setFields((prev) => prev.filter((f) => f.id !== fieldId));
    toast.success("Pole usunięte.");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${asset.id}/main.${ext}`;

    const { error } = await supabase.storage
      .from("asset-images")
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error("Nie udało się przesłać zdjęcia.");
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("asset-images").getPublicUrl(path);

    await supabase
      .from("assets")
      .update({ image_url: publicUrl })
      .eq("id", asset.id);
    setImageUrl(publicUrl);
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

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("assets")
      .update({
        name: form.name,
        serial_number: form.serial_number || null,
        reference_number: form.reference_number || null,
        service_phone: form.service_phone || null,
        service_email: form.service_email || null,
        location: form.location || null,
        next_inspection_date: form.next_inspection_date || null,
        notes: form.notes || null,
        status,
      })
      .eq("id", asset.id);

    if (error) {
      toast.error("Nie udało się zapisać.");
      setSaving(false);
      return;
    }

    // Zapisz nowe pola
    const validNewFields = newFields.filter(
      (f) => f.label.trim() && f.value.trim(),
    );
    if (validNewFields.length > 0) {
      await supabase.from("asset_fields").insert(
        validNewFields.map((f) => ({
          asset_id: asset.id,
          label: f.label,
          value: f.value,
        })),
      );
      setNewFields([]);
    }

    const fieldUpdates = fields.map((f) =>
      supabase
        .from("asset_fields")
        .update({ label: f.label, value: f.value })
        .eq("id", f.id),
    );
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
                src={`${imageUrl}?t=${Date.now()}`}
                alt={form.name}
                className="w-50 h-50 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex flex-col gap-1.5">
                <Button variant="outline" asChild disabled={uploading}>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {uploading ? (
                      <Loader2 size={14} className="animate-spin mr-1.5" />
                    ) : (
                      <Upload size={14} className="mr-1.5" />
                    )}
                    {uploading ? "Przesyłanie..." : "Zmień zdjęcie"}
                  </label>
                </Button>
                <Button onClick={handleImageDelete} variant="destructive">
                  <Trash2 size={14} />
                  Usuń zdjęcie
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <Upload size={20} className="text-gray-400" />
              </div>
              <div>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {uploading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    {uploading ? "Przesyłanie..." : "Dodaj zdjęcie"}
                  </span>
                </label>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP</p>
              </div>
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

      {/* Podstawowe informacje */}
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

      {/* Serwisant */}
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Serwisant
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="service_phone">Telefon</Label>
            <Input
              id="service_phone"
              name="service_phone"
              placeholder="np. 739907919"
              value={form.service_phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="service_email">Email</Label>
            <Input
              id="service_email"
              name="service_email"
              type="email"
              placeholder="serwis@firma.pl"
              value={form.service_email}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Notatki */}
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Notatki
        </h2>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Dodatkowe informacje o maszynie..."
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="resize-none"
        />
      </div>

      {/* <div className="space-y-1.5">
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="working">
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle2 />
                Sprawna
              </span>
            </SelectItem>
            <SelectItem value="broken">
              <span className="text-red-600 flex items-center gap-1">
                <TriangleAlert />
                Uszkodzona
              </span>
            </SelectItem>
            <SelectItem value="maintenance">
              <span className="text-yellow-600 flex items-center gap-1">
                <Wrench />W serwisie
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* Własne pola */}
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Własne pola
        </h2>

        {/* Istniejące */}
        {fields.map((field) => (
          <div key={field.id} className="flex items-center gap-2 mb-2">
            <Input
              value={field.label}
              onChange={(e) =>
                updateExistingField(field.id, "label", e.target.value)
              }
              className="max-w-35 "
            />
            <Input
              value={field.value}
              onChange={(e) =>
                updateExistingField(field.id, "value", e.target.value)
              }
              className="flex-1 "
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

        {/* Nowe */}
        {newFields.map((field, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <Input
              placeholder="Nazwa"
              value={field.label}
              onChange={(e) => updateNewField(i, "label", e.target.value)}
              className="max-w-35"
            />
            <Input
              placeholder="Wartość"
              value={field.value}
              onChange={(e) => updateNewField(i, "value", e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeNewField(i)}
              className="text-gray-400 hover:text-red-500 shrink-0"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        ))}

        <Button variant="outline" onClick={addNewField}>
          <Plus size={14} />
          Dodaj pole
        </Button>
      </div>

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
