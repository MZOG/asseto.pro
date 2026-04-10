"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { ProFeaturesModal } from "./pro-features-modal";
import { useTranslations, useLocale } from "next-intl";

interface Props {
  assetName: string;
  description: string | null;
  createdAt: string;
  companyName: string | null;
  serviceEmail: string | null;
  isPro: boolean;
  serviceToken: string | null;
}

export default function NotifyServiceButton({
  assetName,
  description,
  createdAt,
  companyName,
  serviceEmail,
  isPro,
  serviceToken,
}: Props) {
  const t = useTranslations("panel.issuePage");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(() => {
    const serviceUrl = serviceToken
      ? `${typeof window !== "undefined" ? window.location.origin : "https://asseto.pro"}/serwis/${serviceToken}`
      : null;

    const reportedAt = new Date(createdAt).toLocaleString(
      locale === "en" ? "en-US" : locale === "de" ? "de-DE" : "pl-PL",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );

    return [
      t("emailCompany", { company: companyName ?? "—" }),
      t("emailDate", { date: reportedAt }),
      t("emailAsset", { asset: assetName }),
      "",
      t("emailDescription"),
      description ?? t("noDescription"),
      "",
      serviceUrl ? t("emailPortal", { url: serviceUrl }) : "",
    ]
      .filter(Boolean)
      .join("\n");
  });

  if (!serviceEmail) {
    return <p className="text-xs text-gray-400 mt-5">{t("noEmail")}</p>;
  }

  const handleSend = async () => {
    setLoading(true);
    const res = await fetch("/api/issues/notify-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: serviceEmail,
        subject: t("emailSubject", { asset: assetName }),
        message,
      }),
    });
    if (!res.ok) {
      toast.error(t("errorNotify"));
      setLoading(false);
      return;
    }
    toast.success(t("successNotify", { email: serviceEmail }));
    setOpen(false);
    setLoading(false);
  };

  if (!isPro) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 mt-3">
        <p className="text-xs text-gray-500 flex-1 text-center md:text-left">
          {t("notifyPro")}
        </p>
        <ProFeaturesModal />
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-3">
      <Button variant="outline" onClick={() => setOpen((prev) => !prev)}>
        <Mail size={14} className="mr-1.5" />
        {t("notifyButton")}
        {open ? (
          <ChevronUp size={13} className="ml-1.5" />
        ) : (
          <ChevronDown size={13} className="ml-1.5" />
        )}
      </Button>
      {open && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            {t("to")}{" "}
            <span className="text-gray-600 font-medium">{serviceEmail}</span>
          </p>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            className="text-sm bg-white resize-none"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                  {t("sending")}
                </>
              ) : (
                <>
                  <Mail size={13} className="mr-1.5" />
                  {t("send")}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
