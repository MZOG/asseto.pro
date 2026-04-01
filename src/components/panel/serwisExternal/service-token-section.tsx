"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link2, RefreshCw, Copy, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  assetId: string;
  serviceToken: string | null;
}

export default function ServiceTokenSection({
  assetId,
  serviceToken: initialToken,
}: Props) {
  const t = useTranslations("panel.serviceToken");
  const [token, setToken] = useState(initialToken);
  const [generating, setGenerating] = useState(false);

  const serviceUrl = token ? `${window.location.origin}/serwis/${token}` : null;

  const generateToken = async () => {
    setGenerating(true);
    const supabase = createClient();
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const newToken = Array.from(
      { length: 16 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
    const { error } = await supabase
      .from("assets")
      .update({ service_token: newToken })
      .eq("id", assetId);
    if (error) toast.error(t("errorGenerate"));
    else {
      setToken(newToken);
      toast.success(t("successGenerate"));
    }
    setGenerating(false);
  };

  const copyLink = () => {
    if (!serviceUrl) return;
    navigator.clipboard.writeText(serviceUrl);
    toast.success(t("successCopy"));
  };

  return (
    <div>
      <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        {t("title")}
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
              {t("copy")}
            </Button>
            <Button
              variant="ghost"
              onClick={generateToken}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                  {t("generating")}
                </>
              ) : (
                <>
                  <RefreshCw size={13} className="mr-1.5" />
                  {t("reset")}
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400">{t("desc")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">{t("noTokenDesc")}</p>
          <Button
            variant="outline"
            onClick={generateToken}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 size={13} className="animate-spin mr-1.5" />
                {t("generating")}
              </>
            ) : (
              <>
                <Link2 size={13} className="mr-1.5" />
                {t("generate")}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
