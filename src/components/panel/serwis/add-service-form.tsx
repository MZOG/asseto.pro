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
import { useTranslations } from "next-intl";

export default function AddServiceForm({ assetId }: { assetId: string }) {
  const t = useTranslations("panel.addServiceForm");
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

  const serviceTypes = [
    { value: "inspection", label: t("types.inspection") },
    { value: "repair", label: t("types.repair") },
    { value: "replacement", label: t("types.replacement") },
  ];

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
      toast.error(t("errorDate"));
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
      toast.error(t("errorSave"));
      setSaving(false);
      return;
    }

    toast.success(t("success"));
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
          <Label htmlFor="serviced_at">{t("servicedAt")}</Label>
          <Input
            id="serviced_at"
            name="serviced_at"
            type="date"
            value={form.serviced_at}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="next_service_at">{t("nextServiceAt")}</Label>
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
          <Label>{t("type")}</Label>
          <Select
            value={form.type}
            onValueChange={(v) => setForm((prev) => ({ ...prev, type: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="performed_by">{t("performedBy")}</Label>
          <Input
            id="performed_by"
            name="performed_by"
            placeholder={t("performedByPlaceholder")}
            value={form.performed_by}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cost">{t("cost")}</Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          placeholder={t("costPlaceholder")}
          value={form.cost}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">{t("notes")}</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder={t("notesPlaceholder")}
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <Label>
          {t("photo")}{" "}
          <span className="text-gray-400 font-normal">
            {t("photoOptional")}
          </span>
        </Label>
        {imagePreview ? (
          <div className="relative w-full">
            <img
              src={imagePreview}
              alt={t("preview")}
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
            <span className="text-sm text-gray-500">{t("addPhoto")}</span>
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
            {t("saving")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
    </div>
  );
}
