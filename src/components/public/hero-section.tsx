import { LogIn, Zap, Shield, BarChart3 } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import DashboardImage from "../../../public/dashboard.png";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";
export default async function Hero() {
  const t = await getTranslations("landing.hero");

  const badges = [
    { icon: Zap, label: t("badge1") },
    { icon: Shield, label: t("badge2") },
    { icon: BarChart3, label: t("badge3") },
  ];

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="relative max-w-6xl px-5 mx-auto pt-14 pb-16">
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            {t("betaBadge")}
          </span>
        </div>

        <h1 className="text-center text-4xl md:text-5xl font-semibold text-gray-900 leading-[1.1] tracking-tight max-w-4xl mx-auto text-balance">
          {t("title").split(t("titleHighlight"))[0]}
          <span className="relative inline-block">
            <span className="relative z-10 text-blue-600">
              {t("titleHighlight")}
            </span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 z-0 rounded" />
          </span>
          {t("title").split(t("titleHighlight"))[1]}
        </h1>

        <p className="text-center text-gray-500 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
          {t("subtitle")}
          <span className="block">{t("subtitleSecond")}</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700! text-white rounded-lg px-5 shadow-lg shadow-blue-200"
          >
            <Link href="/rejestracja" data-umami-event="Hero signup register">
              {t("cta")}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="rounded-lg">
            <Link href="/logowanie" data-umami-event="Hero login click">
              <LogIn size={16} className="mr-1.5" />
              {t("ctaLogin")}
            </Link>
          </Button>
        </div>

        <div className="md:text-xs flex flex-col md:flex-row items-center justify-center gap-2 mt-4 bg-white border border-gray-200 rounded-xl sm:px-4 py-4 max-w-lg mx-auto">
          <span className="text-gray-500">{t("demoText")}</span>
          <Link
            data-umami-event="Demo login"
            href={{
              pathname: "/logowanie",
              query: { demo: true },
            }}
            className="md:text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {t("demoLink")}
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-xs text-gray-400"
            >
              <Icon size={13} className="text-gray-400" />
              {label}
            </div>
          ))}
        </div>

        <div className="mt-16 relative">
          <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-300/50">
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 max-w-xs mx-auto text-center">
                  {t("browserBar")}
                </div>
              </div>
            </div>
            <Image
              src={DashboardImage}
              alt={t("imageAlt")}
              className="w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
