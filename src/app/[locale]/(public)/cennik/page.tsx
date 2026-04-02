import { Link } from "@/i18n/routing";
import { Check, Minus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { getTranslations } from "next-intl/server";
import { generateSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.pricing" });

  return generateSeo({
    title: t("title"),
    description: t("description"),
    locale,
    pathnameKey: "/cennik",
  });
}

export default async function CennikPage() {
  const t = await getTranslations("pricingPage");

  const features = [
    t("features.qr"),
    t("features.panel"),
    t("features.emailIssues"),
    t("features.photos"),
    t("features.history"),
    t("features.emailService"),
    t("features.servicePortal"),
    t("features.serviceManagement"),
    t("features.reminders"),
    t("features.priorities"),
    t("features.reports"),
    t("features.export"),
    t("features.support"),
  ];

  const plans = [
    {
      key: "free",
      ctaHref: "/rejestracja" as const,
      ctaVariant: "outline" as const,
      recommended: false,
      includedFeatures: 5,
    },
    {
      key: "starter",
      ctaHref: "/rejestracja" as const,
      ctaVariant: "outline" as const,
      recommended: false,
      includedFeatures: features.length,
    },
    {
      key: "growth",
      ctaHref: "/rejestracja" as const,
      ctaVariant: "default" as const,
      recommended: true,
      includedFeatures: features.length,
    },
    {
      key: "business",
      ctaHref: "/rejestracja" as const,
      ctaVariant: "outline" as const,
      recommended: false,
      includedFeatures: features.length,
    },
    {
      key: "enterprise",
      ctaHref: "/rejestracja" as const,
      ctaVariant: "outline" as const,
      recommended: false,
      includedFeatures: features.length,
    },
  ];

  return (
    <div className="pt-14 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase text-blue-600 mb-3 block">
            {t("badge")}
          </span>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            {t("description")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start mb-12 mt-12">
            {plans.map((plan) => (
              <div
                key={plan.key}
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
                      {t("popular")}
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    {t(`plans.${plan.key}.name`)}
                  </p>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900">
                      {t(`plans.${plan.key}.price`)}
                    </span>
                    <span className="text-xs text-gray-400 mb-3">
                      {t(`plans.${plan.key}.period`)}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 font-semibold">
                    {t(`plans.${plan.key}.limit`)}
                  </p>
                </div>
                <Button
                  asChild
                  variant={plan.ctaVariant}
                  className={`w-full ${plan.recommended ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                >
                  <Link href={plan.ctaHref}>{t(`plans.${plan.key}.cta`)}</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Funkcje */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <p className="font-semibold text-gray-900 mb-1">
                {t("allPlansInclude")}
              </p>
              <p className="text-xs text-gray-400">{t("differenceNote")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mx-auto">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Check size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Minus size={14} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t("freeNote")}
              </p>
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-center text-sm text-gray-400 mt-8">
            {t("questions")}{" "}
            <Link
              href="/kontakt"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t("contact")}
            </Link>{" "}
            {t("replyTime")}
          </p>
        </div>
      </div>
    </div>
  );
}
