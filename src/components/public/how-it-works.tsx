import { QrCode, LayoutDashboard, ScanQrCode } from "lucide-react";
import { getTranslations } from "next-intl/server";

const icons = [QrCode, ScanQrCode, LayoutDashboard];

export default async function HowItWorks() {
  const t = await getTranslations("landing.howItWorks");
  const cards = t.raw("cards") as { title: string; description: string }[];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto px-5">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold uppercase text-blue-600 mb-3 block">
            {t("badge")}
          </span>
          <h2 className="text-3xl font-semibold text-gray-900 leading-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <div
                key={card.title}
                className="relative bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-200"
              >
                <span className="absolute top-5 right-5 text-xs font-mono text-gray-200 font-bold">
                  0{i + 1}
                </span>
                <div className="w-10 h-10 bg-blue-50 rounded-sm flex items-center justify-center mb-5">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <h3 className="text-gray-900 font-medium text-lg mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
