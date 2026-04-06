import { getTranslations } from "next-intl/server";
import { ScanQrCode } from "lucide-react";
import ReportForm from "@/components/public/report-form";

export default async function ScanningSteps() {
  const t = await getTranslations("landing.scanningSteps");
  const steps = t.raw("steps") as {
    number: string;
    title: string;
    description: string;
  }[];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold uppercase text-blue-600 mb-3 block">
              {t("badge")}
            </span>
            <h2 className="text-3xl font-semibold text-gray-900 leading-tight mb-4">
              {t("title")}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-10">
              {t("description")}
            </p>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={step.number} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {step.number}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px flex-1 bg-blue-100 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-gray-900 font-semibold text-base mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-100 text-balance">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="flex items-center justify-center">
                <div className="relative w-72 h-150 rounded-[45px] shadow-[0_0_2px_2px_rgba(255,255,255,0.1)] border-8 border-zinc-900">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-22.5 h-5.5 bg-zinc-900 rounded-full z-20"></div>

                  <div className="absolute -inset-px border-[3px] border-zinc-700 border-opacity-40 rounded-[37px] pointer-events-none"></div>

                  <div className="relative w-full h-full rounded-[37px] overflow-hidden flex items-center justify-center">
                    <section id="asseto-screen">
                      <header className="flex items-center gap-2 justify-center mb-5">
                        <div className="bg-blue-600 text-white p-1 rounded-sm">
                          <ScanQrCode />
                        </div>
                        <p className="font-medium">Asseto</p>
                      </header>

                      <div className="px-5">
                        <ReportForm assetId="83jfu7" disabled />
                      </div>
                    </section>
                  </div>

                  <div className="absolute -left-3 top-20 w-1.5 h-8 bg-zinc-900 rounded-l-md shadow-md"></div>

                  <div className="absolute -left-3 top-36 w-1.5 h-12 bg-zinc-900 rounded-l-md shadow-md"></div>

                  <div className="absolute -left-3 top-52 w-1.5 h-12 bg-zinc-900 rounded-l-md shadow-md"></div>

                  <div className="absolute -right-3 top-36 w-1.5 h-16 bg-zinc-900 rounded-r-md shadow-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
