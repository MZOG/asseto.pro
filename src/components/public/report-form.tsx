// src/app/report/[id]/report-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ReportForm({ assetId }: { assetId: number }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Opisz usterkę przed wysłaniem.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.from("issues").insert({
      asset_id: assetId,
      description: description.trim(),
      status: "broken",
    });

    if (error) {
      setError("Coś poszło nie tak. Spróbuj ponownie.");
      setLoading(false);
      return;
    }

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

      <div className="space-y-1.5">
        <Label
          htmlFor="description"
          className="text-gray-700 text-sm font-medium"
        >
          Opis usterki
        </Label>
        <Textarea
          id="description"
          placeholder="Opisz co się dzieje z maszyną..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500 focus-visible:border-blue-500 resize-none"
        />
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
