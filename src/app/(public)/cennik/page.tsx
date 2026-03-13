// src/app/(public)/cennik/page.tsx
import Link from "next/link";
import { Check, Minus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Darmowy",
    price: "0 zł",
    period: "na zawsze",
    description: "Idealny do przetestowania systemu.",
    cta: "Zacznij za darmo",
    ctaHref: "/rejestracja",
    ctaVariant: "outline" as const,
    recommended: false,
    features: [
      { label: "10 maszyn", included: true },
      { label: "Zgłoszenia przez QR", included: true },
      { label: "Panel zarządzania", included: true },
      { label: "Powiadomienia Telegram", included: false },
      { label: "Raporty", included: false },
      { label: "Eksport danych", included: false },
      { label: "Zarządzanie serwisami", included: false },
      { label: "Priorytetowe wsparcie", included: false },
    ],
  },
  {
    name: "Pro",
    price: "149 zł",
    period: "miesięcznie",
    description: "Dla firm które chcą mieć pełną kontrolę.",
    cta: "Wybierz Pro",
    ctaHref: "/rejestracja",
    ctaVariant: "default" as const,
    recommended: true,
    features: [
      { label: "Nielimitowane maszyny", included: true },
      { label: "Zgłoszenia przez QR", included: true },
      { label: "Panel zarządzania", included: true },
      { label: "Powiadomienia Telegram", included: true },
      { label: "Raporty", included: true },
      { label: "Eksport danych", included: true },
      { label: "Zarządzanie serwisami", included: true },
      { label: "Priorytetowe wsparcie", included: true },
    ],
  },
  {
    name: "Business",
    price: "Wycena",
    period: "indywidualna",
    description: "Dla dużych organizacji.",
    cta: "Skontaktuj się",
    ctaHref: "/kontakt",
    ctaVariant: "outline" as const,
    recommended: false,
    disabled: true,
    features: [
      { label: "Wszystko z planu Pro", included: true },
      { label: "Wiele lokalizacji", included: true },
      { label: "Dedykowany opiekun", included: true },
      { label: "Integracje na zamówienie", included: true },
      { label: "SLA", included: true },
      { label: "Szkolenie zespołu", included: true },
      { label: "Migracja danych", included: true },
      { label: "Faktura VAT", included: true },
    ],
  },
];

export default function CennikPage() {
  return (
    <div className="pt-5 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            Cennik
          </span>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Prosty, przejrzysty cennik
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Zacznij za darmo i przejdź na wyższy plan gdy Twój biznes rośnie.
            Bez ukrytych opłat.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border p-6 bg-white",
                plan.recommended
                  ? "border-blue-500  ring-1 ring-blue-500"
                  : "border-gray-200",
                plan.disabled && "opacity-50 pointer-events-none",
              )}
            >
              {/* Recommended badge */}
              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    <Zap size={11} />
                    Rekomendowany
                  </span>
                </div>
              )}

              {/* Plan info */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  {plan.name}
                </p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-400 mb-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>

              {/* CTA */}
              <Button
                asChild
                variant={plan.ctaVariant}
                className={`w-full h-10 mb-6 ${plan.recommended ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
              >
                <Link href={plan.ctaHref}>{plan.cta}</Link>
              </Button>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-2.5">
                    {feature.included ? (
                      <Check size={15} className="text-blue-600 shrink-0" />
                    ) : (
                      <Minus size={15} className="text-gray-300 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-gray-400 mt-10">
          Masz pytania?{" "}
          <Link
            href="/kontakt"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Napisz do nas
          </Link>{" "}
          — odpowiemy w ciągu 24 godzin.
        </p>
      </div>
    </div>
  );
}
