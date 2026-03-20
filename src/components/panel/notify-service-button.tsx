"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Loader2, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useUpgrade } from "@/hooks/use-upgrade";
import { ProFeaturesModal } from "./pro-features-modal";

interface Props {
  issueId: string;
  assetName: string;
  description: string | null;
  createdAt: string;
  companyName: string | null;
  serviceEmail: string | null;
  isPro: boolean;
  serviceToken: string | null;
}

export default function NotifyServiceButton({
  issueId,
  assetName,
  description,
  createdAt,
  companyName,
  serviceEmail,
  isPro,
  serviceToken,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { upgrade, loading: upgradeLoading } = useUpgrade();

  const serviceUrl = serviceToken
    ? `${window.location.origin}/serwis/${serviceToken}`
    : null;

  const reportedAt = new Date(createdAt).toLocaleString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const defaultMessage = [
    `Firma: ${companyName ?? "—"}`,
    `Data zgłoszenia: ${reportedAt}`,
    `Maszyna: ${assetName}`,
    ``,
    `Opis usterki:`,
    description ?? "Brak opisu",
    ``,
    serviceUrl ? `Panel serwisanta: ${serviceUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const [message, setMessage] = useState(defaultMessage);

  if (!serviceEmail) {
    return (
      <p className="text-xs text-gray-400 mt-5">
        Brak adresu e-mail serwisanta. Dodaj go w ustawieniach maszyny.
      </p>
    );
  }

  const handleSend = async () => {
    setLoading(true);

    const res = await fetch("/api/issues/notify-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: serviceEmail,
        subject: `Zgłoszenie usterki — ${assetName}`,
        message,
      }),
    });

    if (!res.ok) {
      toast.error("Nie udało się wysłać wiadomości.");
      setLoading(false);
      return;
    }

    toast.success(`E-mail wysłany do ${serviceEmail}`);
    setOpen(false);
    setLoading(false);
  };

  if (!isPro) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 mt-3">
        <div>
          <Mail size={14} className="text-gray-400 shrink-0 hidden" />
          <p className="text-xs text-gray-500 flex-1 text-center md:text-left">
            Powiadomienia e-mail do serwisanta dostępne w planie Pro.
          </p>
        </div>
        <ProFeaturesModal />
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-3">
      <Button variant="outline" onClick={() => setOpen((prev) => !prev)}>
        <Mail size={14} className="mr-1.5" />
        Poinformuj serwis
        {open ? (
          <ChevronUp size={13} className="ml-1.5" />
        ) : (
          <ChevronDown size={13} className="ml-1.5" />
        )}
      </Button>

      {open && (
        <div className="pace-y-3 mt-1">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              Do:{" "}
              <span className="text-gray-600 font-medium">{serviceEmail}</span>
            </p>
          </div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            className="text-sm bg-white resize-none"
          />
          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                  Wysyłanie...
                </>
              ) : (
                <>
                  <Mail size={13} className="mr-1.5" />
                  Wyślij e-mail
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Anuluj
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
