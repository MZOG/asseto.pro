import Link from "next/link";
import { Check, Minus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cennik",
  description:
    "Zacznij za darmo i przejdź na wyższy plan gdy Twój biznes rośnie. Prosty, przejrzysty cennik bez ukrytych opłat.",
  openGraph: {
    title: "Cennik - Asseto",
    description:
      "Plan darmowy do 10 urządzeń. Plany płatne od 99 zł miesięcznie.",
    images: [
      {
        url: "https://asseto.pro/api/og?title=Prosty, przejrzysty cennik&description=Zacznij za darmo i przejdź na wyższy plan gdy Twój biznes rośnie.",
        width: 1200,
        height: 630,
      },
    ],
    url: "https://asseto.pro/cennik",
    siteName: "Asseto",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "/api/og?title=Cennik&description=Plan darmowy do 10 urządzeń. Plany płatne od 99 zł miesięcznie.",
    ],
  },
};

const features = [
  { label: "Zgłoszenia przez QR", included: true },
  { label: "Panel zarządzania", included: true },
  { label: "Powiadomienia e-mail o awariach", included: true },
  { label: "Zdjęcia w zgłoszeniach", included: true },
  { label: "Historia awarii", included: true },
  { label: "Powiadomienia e-mail do serwisanta", included: true },
  { label: "Panel serwisanta z dostępem przez link", included: true },
  { label: "Zarządzanie serwisami i przeglądami", included: true },
  { label: "Przypomnienia o serwisach", included: true },
  { label: "Priorytety zgłoszeń", included: true },
  { label: "Raporty tygodniowe", included: true },
  { label: "Eksport danych (CSV, PDF)", included: true },
  { label: "Priorytetowe wsparcie", included: true },
];

const plans = [
  {
    name: "Darmowy",
    price: "0 zł",
    period: "na zawsze",
    limit: "do 10 maszyn",
    description: "Idealny do przetestowania.",
    cta: "Zacznij za darmo",
    ctaHref: "/rejestracja",
    ctaVariant: "outline" as const,
    recommended: false,
    includedFeatures: 5,
  },
  {
    name: "Starter",
    price: "99 zł",
    period: "miesięcznie + VAT",
    limit: "do 50 maszyn",
    description: "Dla małych obiektów i firm.",
    cta: "Wybierz Starter",
    ctaHref: "/rejestracja",
    ctaVariant: "outline" as const,
    recommended: false,
    includedFeatures: features.length,
  },
  {
    name: "Growth",
    price: "199 zł",
    period: "miesięcznie + VAT",
    limit: "do 100 maszyn",
    description: "Dla rozwijających się firm.",
    cta: "Wybierz Growth",
    ctaHref: "/rejestracja",
    ctaVariant: "default" as const,
    recommended: true,
    includedFeatures: features.length,
  },
  {
    name: "Business",
    price: "299 zł",
    period: "miesięcznie + VAT",
    limit: "do 150 maszyn",
    description: "Dla większych obiektów.",
    cta: "Wybierz Business",
    ctaHref: "/rejestracja",
    ctaVariant: "outline" as const,
    recommended: false,
    includedFeatures: features.length,
  },
  {
    name: "Enterprise",
    price: "399 zł",
    period: "miesięcznie + VAT",
    limit: "do 200 maszyn",
    description: "Dla dużych organizacji.",
    cta: "Wybierz Enterprise",
    ctaHref: "/rejestracja",
    ctaVariant: "outline" as const,
    recommended: false,
    includedFeatures: features.length,
  },
];

export default function CennikPage() {
  return (
    <div className="pt-14 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase text-blue-600 mb-3 block">
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

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border p-5 bg-white flex flex-col",
                plan.recommended
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-200",
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    <Zap size={11} />
                    Popularny
                  </span>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  {plan.name}
                </p>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-xs text-gray-400 mb-3">
                    {plan.period}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-semibold mb-1">
                  {plan.limit}
                </p>
                <p className="text-xs text-gray-400">{plan.description}</p>
              </div>

              <Button
                asChild
                variant={plan.ctaVariant}
                className={`w-full  ${plan.recommended ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
              >
                <Link href={plan.ctaHref}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-6 border-b border-gray-100">
            <div className="col-span-1 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Funkcja
              </p>
            </div>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "p-4 text-center",
                  plan.recommended && "bg-blue-50/50",
                )}
              >
                <p className="text-xs font-semibold text-gray-700">
                  {plan.name}
                </p>
              </div>
            ))}
          </div>

          {/* Limit maszyn */}
          <div className="grid grid-cols-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="col-span-1 p-4">
              <p className="text-sm text-gray-700 font-medium">Limit maszyn</p>
            </div>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "p-4 text-center",
                  plan.recommended && "bg-blue-50/50",
                )}
              >
                <p className="text-xs font-semibold text-blue-600">
                  {plan.limit}
                </p>
              </div>
            ))}
          </div>

          {/* Features */}
          {features.map((feature, i) => (
            <div
              key={feature.label}
              className={cn(
                "grid grid-cols-6 hover:bg-gray-50 transition-colors",
                i < features.length - 1 && "border-b border-gray-100",
              )}
            >
              <div className="col-span-1 p-4">
                <p className="text-sm text-gray-700">{feature.label}</p>
              </div>
              {plans.map((plan) => {
                const included =
                  plan.name === "Darmowy" ? i < plan.includedFeatures : true;
                return (
                  <div
                    key={plan.name}
                    className={cn(
                      "p-4 flex items-center justify-center",
                      plan.recommended && "bg-blue-50/50",
                    )}
                  >
                    {included ? (
                      <Check size={16} className="text-blue-600" />
                    ) : (
                      <Minus size={16} className="text-gray-300" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Darmowy plan — które features */}
        <p className="text-xs text-gray-400 text-center mt-4">
          * Plan darmowy zawiera: zgłoszenia przez QR, panel zarządzania,
          powiadomienia e-mail o awariach, zdjęcia w zgłoszeniach i historię
          awarii.
        </p>

        {/* Bottom note */}
        <p className="text-center text-sm text-gray-400 mt-8">
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
