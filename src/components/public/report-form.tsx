"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  X,
  Phone,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ReportForm({ assetId }: { assetId: string }) {
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Opisz usterkę przed wysłaniem.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();

    // Wgraj zdjęcie jeśli jest
    let imageUrl: string | null = null;
    if (image) {
      const ext = image.name.split(".").pop();
      const path = `${assetId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("issue-images")
        .upload(path, image, { upsert: false });

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("issue-images").getPublicUrl(path);
        imageUrl = publicUrl;
      }
    }

    const { data: newIssue, error: insertError } = await supabase
      .from("issues")
      .insert({
        asset_id: assetId,
        description: description.trim(),
        status: "broken",
        reporter_phone: phone.trim() || null,
        image_url: imageUrl,
      })
      .select("id")
      .single();

    if (insertError || !newIssue) {
      setError("Coś poszło nie tak. Spróbuj ponownie.");
      setLoading(false);
      return;
    }

    await fetch("/api/issues/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issueId: newIssue.id }),
    });

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 text-center py-1">
        <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
          <CheckCircle2 size={22} className="text-green-600" />
        </div>
        <div>
          <p className="text-gray-900 font-medium text-sm">
            Zgłoszenie wysłane
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Dziękujemy.{" "}
            <span className="block">
              Obsługa techniczna zostanie powiadomiona.
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert className="bg-red-50 border-red-200 py-2.5 flex items-center">
          <AlertCircle size={14} className="text-red-500" />
          <AlertDescription className="text-xs text-red-600 ml-1">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Opis */}
      <div className="space-y-1.5">
        <Label
          htmlFor="description"
          className="text-gray-700 text-sm font-medium"
        >
          Opis usterki <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Opisz co się dzieje..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 resize-none"
        />
      </div>

      {/* Zdjęcie */}
      <div className="space-y-1.5">
        <Label className="text-gray-700 text-sm font-medium">
          Zdjęcie{" "}
          <span className="text-gray-400 font-normal">(opcjonalnie)</span>
        </Label>

        {imagePreview ? (
          <div className="relative w-full">
            <img
              src={imagePreview}
              alt="Podgląd"
              className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <X size={13} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
          >
            <Upload size={20} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              Kliknij aby dodać zdjęcie
            </span>
            <span className="text-xs text-gray-400">JPG, PNG, WEBP</span>
          </label>
        )}
        <input
          ref={fileRef}
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Telefon */}
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">
          Numer telefonu{" "}
          <span className="text-gray-400 font-normal">(opcjonalnie)</span>
        </Label>
        <div className="relative">
          <Phone
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            id="phone"
            type="tel"
            placeholder="np. 600 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-9 bg-white border-gray-300"
          />
        </div>
        <p className="text-xs text-gray-400">
          Podaj numer jeśli chcesz żebyśmy mogli się z Tobą skontaktować.
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10"
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin mr-2" />
            Wysyłanie...
          </>
        ) : (
          "Zgłoś usterkę"
        )}
      </Button>
    </form>
  );
}
