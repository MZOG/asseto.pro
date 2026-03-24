"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Zap, Loader2, ExternalLink, AlertTriangle } from "lucide-react";
import {
  planConfig,
  getRecommendedPlan,
  type Plan,
  isPro,
} from "@/lib/utils/plan";

interface Props {
  plan: string;
  assetCount: number;
  subscriptionStatus: string | null;
  subscriptionEndsAt: string | null;
}

const plans: { key: Plan; label: string; price: number; limit: string }[] = [
  { key: "starter", label: "Starter", price: 99, limit: "do 50 maszyn" },
  { key: "growth", label: "Growth", price: 199, limit: "do 100 maszyn" },
  { key: "business", label: "Business", price: 299, limit: "do 150 maszyn" },
  {
    key: "enterprise",
    label: "Enterprise",
    price: 399,
    limit: "do 200 maszyn",
  },
];

export default function SubscriptionSection({
  plan,
  assetCount,
  subscriptionStatus,
  subscriptionEndsAt,
}: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showPlans, setShowPlans] = useState(false);

  const isUserPro = isPro(plan);
  const isCanceled = subscriptionStatus === "canceled";
  const isPastDue = subscriptionStatus === "past_due";
  const endsAt = subscriptionEndsAt
    ? new Date(subscriptionEndsAt).toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const currentPlanConfig = planConfig[plan as Plan] ?? planConfig.free;
  const recommendedPlan = getRecommendedPlan(assetCount);

  const handleUpgrade = async (planKey: Plan) => {
    setLoading(planKey);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planKey }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error(data.error ?? "Nie udało się uruchomić płatności.");
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error("Nie udało się otworzyć portalu.");
      setLoading(null);
    }
  };

  return (
    <div>
      <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4 ">
        Subskrypcja
      </h2>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 max-w-md">
        {/* Aktualny plan */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Plan {currentPlanConfig.label}
            </p>
            {isUserPro && !isCanceled && (
              <p className="text-xs text-gray-400 mt-0.5">
                {currentPlanConfig.price} zł / miesiąc · do{" "}
                {currentPlanConfig.limit} maszyn
              </p>
            )}
            {isCanceled && endsAt && (
              <p className="text-xs text-amber-500 mt-0.5">
                Aktywny do {endsAt}
              </p>
            )}
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isUserPro && !isCanceled
                ? "bg-blue-100 text-blue-700"
                : isCanceled
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {isUserPro && !isCanceled
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
              aby zachować dostęp.
            </p>
          </div>
        )}

        {/* Info o liczbie maszyn dla free */}
        {plan === "free" && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <p className="text-xs text-gray-500">
              Używasz{" "}
              <span className="font-semibold text-gray-900">
                {assetCount}/10
              </span>{" "}
              maszyn w planie darmowym.
              {assetCount >= 8 && (
                <span className="text-amber-600 ml-1">
                  Zbliżasz się do limitu.
                </span>
              )}
            </p>
          </div>
        )}

        {/* CTA dla free lub anulowanego */}
        {(!isUserPro || isCanceled) && (
          <Button
            onClick={() => setShowPlans((prev) => !prev)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
          >
            <Zap size={14} className="mr-1.5" />
            {isCanceled ? "Odnów subskrypcję" : "Wybierz plan"}
          </Button>
        )}

        {/* Lista planów — free/anulowany */}
        {showPlans && (!isUserPro || isCanceled) && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {plans.map((p) => {
              const isRecommended = p.key === recommendedPlan;
              const isLoading = loading === p.key;
              return (
                <div
                  key={p.key}
                  className={`border rounded-xl p-4 ${isRecommended ? "border-blue-400 bg-blue-50/50" : "border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {p.label}
                      </span>
                      {isRecommended && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                          Zalecany
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {p.price} zł
                      <span className="text-xs font-normal text-gray-400">
                        /mies.
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{p.limit}</p>
                  <Button
                    onClick={() => handleUpgrade(p.key)}
                    disabled={!!loading}
                    variant={isRecommended ? "default" : "outline"}
                    className={`w-full ${isRecommended ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={13} className="animate-spin mr-1.5" />
                        Przekierowywanie...
                      </>
                    ) : (
                      `Wybierz ${p.label}`
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Zarządzanie aktywnym Pro */}
        {isUserPro && !isCanceled && (
          <div className="space-y-2">
            <Button
              onClick={handlePortal}
              disabled={!!loading}
              variant="outline"
              className="w-full"
            >
              {loading === "portal" ? (
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
            <Button
              onClick={() => setShowPlans((prev) => !prev)}
              variant="ghost"
              className="w-full text-gray-500"
            >
              {showPlans ? "Ukryj plany" : "Zmień plan"}
            </Button>
          </div>
        )}

        {/* Zmiana planu dla aktywnych Pro */}
        {showPlans && isUserPro && !isCanceled && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3">
              Zmiana nastąpi od następnego okresu rozliczeniowego.
            </p>
            {plans.map((p) => {
              const isCurrent = p.key === plan;
              const isLoading = loading === p.key;
              return (
                <div
                  key={p.key}
                  className={`border rounded-xl p-4 ${isCurrent ? "border-blue-300 bg-blue-50/30" : "border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {p.label}
                      </span>
                      {isCurrent && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          Obecny
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {p.price} zł
                      <span className="text-xs font-normal text-gray-400">
                        /mies.
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{p.limit}</p>
                  {!isCurrent && (
                    <Button
                      onClick={() => handleUpgrade(p.key)}
                      disabled={!!loading}
                      variant="outline"
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={13} className="animate-spin mr-1.5" />
                          Przekierowywanie...
                        </>
                      ) : (
                        `Przejdź na ${p.label}`
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
