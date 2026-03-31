import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight, ScanQrCode } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function CtaSection() {
  const t = await getTranslations("landing.cta");

  return (
    <section className="py-20 px-4 bg-blue-600">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
          <ScanQrCode size={24} className="text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          {t("title")}
        </h2>
        <p className="text-blue-200 mb-8 text-base">{t("description")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="bg-white text-blue-600 hover:bg-white/80! hover:text-primary rounded-xl px-4 h-11 font-medium"
          >
            <Link href="/rejestracja">
              {t("register")}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-xl px-4 h-11 font-medium text-white"
          >
            <Link href="/logowanie">{t("demo")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
