"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const statusConfig: Record<string, { label: string; className: string }> = {
  broken: { label: "Uszkodzona", className: "bg-red-100 text-red-700" },
  maintenance: {
    label: "W serwisie",
    className: "bg-yellow-100 text-yellow-700",
  },
  working: { label: "Sprawna", className: "bg-green-100 text-green-700" },
  closed: { label: "Zamknięta", className: "bg-gray-100 text-gray-500" },
};

interface Issue {
  id: string;
  created_at: string;
  description: string | null;
  status: string | null;
  service_notes: string | null;
  reporter_phone: string | null;
  image_url: string | null;
}

export default function ServiceIssueHistory({
  issues,
  assetId,
  token,
}: {
  issues: Issue[];
  assetId: string;
  token: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(
    issues[0]?.id ?? null,
  );
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(issues.map((i) => [i.id, i.service_notes ?? ""])),
  );
  const [saving, setSaving] = useState<string | null>(null);

  const handleSaveNote = async (issueId: string) => {
    setSaving(issueId);
    const supabase = createClient();

    // Weryfikuj token przed zapisem
    const { data: asset } = await supabase
      .from("assets")
      .select("id")
      .eq("service_token", token)
      .eq("id", assetId)
      .single();

    if (!asset) {
      toast.error("Nieprawidłowy token.");
      setSaving(null);
      return;
    }

    const { error } = await supabase
      .from("issues")
      .update({ service_notes: notes[issueId] || null })
      .eq("id", issueId);

    if (error) {
      toast.error("Nie udało się zapisać notatki.");
    } else {
      toast.success("Notatka zapisana.");
    }
    setSaving(null);
  };

  if (issues.length === 0) {
    return <p className="text-sm text-gray-400">Brak awarii.</p>;
  }

  return (
    <div className="space-y-2">
      {issues.map((issue) => {
        const status = statusConfig[issue.status ?? ""] ?? statusConfig.working;
        const isExpanded = expanded === issue.id;
        const date = new Date(issue.created_at).toLocaleDateString("pl-PL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        return (
          <div
            key={issue.id}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(isExpanded ? null : issue.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.className}`}
                >
                  {status.label}
                </span>
                <span className="text-xs text-gray-500">{date}</span>
              </div>
              {isExpanded ? (
                <ChevronUp size={14} className="text-gray-400" />
              ) : (
                <ChevronDown size={14} className="text-gray-400" />
              )}
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                {issue.description && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Opis usterki</p>
                    <p className="text-sm text-gray-700">{issue.description}</p>
                  </div>
                )}
                {issue.image_url && (
                  <img
                    src={issue.image_url}
                    alt="Zdjęcie usterki"
                    className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
                  />
                )}
                {issue.reporter_phone && (
                  <p className="text-xs text-gray-500">
                    📞{" "}
                    <a
                      href={`tel:${issue.reporter_phone}`}
                      className="text-blue-600"
                    >
                      {issue.reporter_phone}
                    </a>
                  </p>
                )}

                {/* Notatka serwisanta */}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">
                    Notatka serwisanta
                  </p>
                  <Textarea
                    value={notes[issue.id] ?? ""}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [issue.id]: e.target.value,
                      }))
                    }
                    placeholder="Dodaj notatkę serwisową..."
                    rows={3}
                    className="text-sm resize-none"
                  />
                  <Button
                    onClick={() => handleSaveNote(issue.id)}
                    disabled={saving === issue.id}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {saving === issue.id ? (
                      <>
                        <Loader2 size={13} className="animate-spin mr-1.5" />
                        Zapisywanie...
                      </>
                    ) : (
                      "Zapisz notatkę"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
