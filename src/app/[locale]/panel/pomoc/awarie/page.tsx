import PageHeader from "@/components/panel/page-header";
import {
  TriangleAlert,
  Wrench,
  CheckCheck,
  QrCode,
  RefreshCw,
  Bell,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

const icons = [QrCode, TriangleAlert, RefreshCw, Bell, Wrench, CheckCheck];
const iconClasses = [
  "text-blue-600 bg-blue-50",
  "text-red-600 bg-red-50",
  "text-yellow-600 bg-yellow-50",
  "text-purple-600 bg-purple-50",
  "text-orange-600 bg-orange-50",
  "text-green-600 bg-green-50",
];

export default async function PomocAwariaPage() {
  const t = await getTranslations("panel.helpIssues");
  const sections = t.raw("sections") as {
    question: string;
    answer: string | null;
    statuses: { label: string; color: string; desc: string }[] | null;
  }[];

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
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconClasses[i]}`}
                >
                  <Icon size={17} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {s.question}
                  </h3>
                  {s.answer && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {s.answer}
                    </p>
                  )}
                  {s.statuses && (
                    <div className="space-y-2 mt-1">
                      {s.statuses.map((status) => (
                        <div
                          key={status.label}
                          className="md:items-center gap-3 flex flex-col md:flex-row"
                        >
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start shrink-0 ${status.color}`}
                          >
                            {status.label}
                          </span>
                          <span className="text-sm text-gray-500">
                            {status.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
