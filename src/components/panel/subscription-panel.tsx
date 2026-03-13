"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Zap, Loader2, ExternalLink, AlertTriangle } from "lucide-react";

interface Props {
  plan: string;
  subscriptionStatus: string | null;
  subscriptionEndsAt: string | null;
}

export default function SubscriptionSection({
  plan,
  subscriptionStatus,
  subscriptionEndsAt,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error("Nie udało się uruchomić płatności.");
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error("Nie udało się otworzyć portalu.");
      setLoading(false);
    }
  };

  const isPro = plan === "pro";
  const isCanceled = subscriptionStatus === "canceled";
  const isPastDue = subscriptionStatus === "past_due";
  const endsAt = subscriptionEndsAt
    ? new Date(subscriptionEndsAt).toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div>
      <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
        Subskrypcja
      </h2>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">
              Plan {isPro ? "Pro" : "Darmowy"}
            </p>
            {isPro && !isCanceled && (
              <p className="text-xs text-gray-400 mt-0.5">149 zł / miesiąc</p>
            )}
            {isCanceled && endsAt && (
              <p className="text-xs text-amber-500 mt-0.5">
                Aktywny do {endsAt}
              </p>
            )}
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isPro && !isCanceled
                ? "bg-blue-100 text-blue-700"
                : isCanceled
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {isPro && !isCanceled
              ? "Aktywny"
              : isCanceled
                ? "Anulowany"
                : "Darmowy"}
          </span>
        </div>

        {/* Ostrzeżenie past_due */}
        {isPastDue && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertTriangle size={15} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-600">
              Ostatnia płatność nie powiodła się. Zaktualizuj metodę płatności
              aby zachować dostęp do planu Pro.
            </p>
          </div>
        )}

        {/* CTA */}
        {!isPro || isCanceled ? (
          <div className="space-y-3">
            {!isPro && (
              <div className="text-xs text-gray-500 space-y-1">
                <p>Plan Pro zawiera:</p>
                <ul className="space-y-0.5 text-gray-400">
                  {[
                    "Nielimitowane maszyny",
                    "Powiadomienia Telegram",
                    "Raporty i eksport danych",
                    "Zarządzanie serwisami",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Zap size={10} className="text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-1.5" />
                  Przekierowywanie...
                </>
              ) : (
                <>
                  <Zap size={14} className="mr-1.5" />
                  {isCanceled
                    ? "Odnów subskrypcję"
                    : "Przejdź na Pro — 149 zł/mies."}
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={handlePortal} disabled={loading} variant="outline">
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
                Przekierowywanie...
              </>
            ) : (
              <>
                <ExternalLink size={14} className="mr-1.5" />
                Zarządzaj subskrypcją
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
