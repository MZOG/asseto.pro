"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link2, RefreshCw, Copy, Loader2 } from "lucide-react";

interface Props {
  assetId: string;
  serviceToken: string | null;
}

export default function ServiceTokenSection({
  assetId,
  serviceToken: initialToken,
}: Props) {
  const [token, setToken] = useState(initialToken);
  const [generating, setGenerating] = useState(false);

  const serviceUrl = token ? `${window.location.origin}/serwis/${token}` : null;

  const generateToken = async () => {
    setGenerating(true);
    const supabase = createClient();

    // Generuj token po stronie klienta
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const newToken = Array.from(
      { length: 16 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");

    const { error } = await supabase
      .from("assets")
      .update({ service_token: newToken })
      .eq("id", assetId);

    if (error) {
      toast.error("Nie udało się wygenerować linku.");
    } else {
      setToken(newToken);
      toast.success("Link wygenerowany.");
    }
    setGenerating(false);
  };

  const copyLink = () => {
    if (!serviceUrl) return;
    navigator.clipboard.writeText(serviceUrl);
    toast.success("Link skopiowany.");
  };

  return (
    <div>
      <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        Link dla serwisanta
      </h2>

      {token ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Link2 size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-600 font-mono truncate flex-1">
              {serviceUrl}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyLink}>
              <Copy size={13} className="mr-1.5" />
              Kopiuj link
            </Button>
            <Button
              variant="ghost"
              onClick={generateToken}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                  Generowanie...
                </>
              ) : (
                <>
                  <RefreshCw size={13} className="mr-1.5" />
                  Resetuj link
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            Serwisant może przeglądać awarie, dodawać notatki i wpisy serwisowe.
            Resetuj link aby unieważnić dostęp.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">
            Wygeneruj link który możesz udostępnić serwisantowi. Serwisant nie
            musi się rejestrować.
          </p>
          <Button
            variant="outline"
            onClick={generateToken}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 size={13} className="animate-spin mr-1.5" />
                Generowanie...
              </>
            ) : (
              <>
                <Link2 size={13} className="mr-1.5" />
                Generuj link dla serwisanta
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
