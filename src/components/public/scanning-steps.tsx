// src/components/public/scanning-steps.tsx

const steps = [
  {
    number: "01",
    title: "Zeskanuj kod QR",
    description:
      "Każde urządzenie ma naklejkę z kodem QR. Wystarczy aparat w telefonie.",
  },
  {
    number: "02",
    title: "Opisz problem",
    description: `Krótki opis wystarczy. Formularz jest prosty i działa na każdym telefonie.`,
  },
  {
    number: "03",
    title: "Gotowe",
    description:
      "Zgłoszenie trafia do panelu natychmiast. Obsługa techniczna widzi problem i może działać.",
  },
];

export default function ScanningSteps() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Lewa — teksty */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
              Zgłaszanie usterek
            </span>
            <h2 className="text-3xl font-semibold text-gray-900 leading-tight mb-4">
              Zgłoszenie w 3 krokach
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-10">
              Zgłaszanie usterek bez konta, bez instalowania czegokolwiek.
            </p>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={step.number} className="flex gap-5">
                  {/* Linia łącząca */}
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

          {/* Prawa — mockup telefonu */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Telefon */}
              <div className="w-64 border rounded-xl">
                <div className="bg-white rounded-xl overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-gray-50 px-5 pt-3 pb-2 flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-gray-400">
                      9:41
                    </span>
                    <div className="w-16 h-4 bg-gray-900 rounded-full" />
                    <span className="text-[10px] text-gray-400">●●●</span>
                  </div>

                  {/* Zawartość */}
                  <div className="px-5 py-4 rounded-bl-xl rounded-br-xl">
                    {/* Logo */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="w-5 h-5 bg-blue-600 rounded-sm" />
                      <span className="text-gray-900 font-semibold text-xs">
                        asseto
                      </span>
                    </div>

                    <p className="text-[9px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                      Zgłoszenie usterki
                    </p>
                    <p className="text-gray-900 font-semibold text-sm mb-4">
                      Tokarka CNC #3
                    </p>

                    {/* Pole tekstowe */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mb-4">
                      <p className="text-[10px] text-gray-400 mb-1">
                        Opis usterki
                      </p>
                      <p className="text-[11px] text-gray-700 leading-relaxed">
                        Maszyna wydaje głośny dźwięk przy uruchomieniu...
                      </p>
                    </div>

                    {/* Przycisk */}
                    <div className="bg-blue-600 rounded-lg py-2 text-center">
                      <span className="text-white text-[12px] font-medium">
                        Zgłoś usterkę
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dekoracja */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-50 rounded-full -z-10" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gray-100 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
