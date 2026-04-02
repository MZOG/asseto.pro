import PageHeader from "@/components/panel/page-header";
import {
  QrCode,
  Plus,
  Image,
  Fingerprint,
  MapPin,
  Wrench,
  Trash2,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

const icons = [Plus, QrCode, Fingerprint, MapPin, Wrench, Image, Trash2];
const iconClasses = [
  "text-blue-600 bg-blue-50",
  "text-blue-600 bg-blue-50",
  "text-purple-600 bg-purple-50",
  "text-green-600 bg-green-50",
  "text-orange-600 bg-orange-50",
  "text-pink-600 bg-pink-50",
  "text-red-600 bg-red-50",
];

export default async function PomocMaszynyPage() {
  const t = await getTranslations("panel.helpAssets");
  const sections = t.raw("sections") as { question: string; answer: string }[];

  return (
    <section>
      <PageHeader title={t("title")} />
      <p className="text-gray-500 text-sm mt-1 mb-8">{t("subtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((s, i) => {
          const Icon = icons[i];
          return (
            <div
              key={s.question}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconClasses[i]}`}
                >
                  <Icon size={17} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {s.question}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {s.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
