"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check } from "lucide-react";

export default function AssetNotesTab({
  assetId,
  initialNotes,
}: {
  assetId: string;
  initialNotes: string | null;
}) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = async (value: string) => {
    setStatus("saving");
    const supabase = createClient();
    await supabase
      .from("assets")
      .update({ notes: value || null })
      .eq("id", assetId);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNotes(value);
    setStatus("idle");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(value), 1000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Notatki
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          {status === "saving" && (
            <>
              <Loader2 size={12} className="animate-spin" />
              Zapisywanie...
            </>
          )}
          {status === "saved" && (
            <>
              <Check size={12} className="text-green-500" />
              Zapisano
            </>
          )}
        </div>
      </div>
      <Textarea
        placeholder="Dodatkowe informacje o maszynie, uwagi, historia..."
        value={notes}
        onChange={handleChange}
        rows={10}
        className="resize-none"
      />
      <p className="text-xs text-gray-400">
        Notatki zapisują się automatycznie.
      </p>
    </div>
  );
}
