import { QrCode, LayoutDashboard, ScanLine } from "lucide-react";

const cards = [
  {
    icon: QrCode,
    title: "Oznacz swój sprzęt",
    description:
      "Wygeneruj kod QR dla każdego urządzenia i wydrukuj go w dowolnym rozmiarze. Naklejka na maszynie to wszystko, czego potrzebuje Twój zespół.",
  },
  {
    icon: ScanLine,
    title: "Błyskawiczne zgłoszenia",
    description:
      "Pracownik skanuje kod QR, opisuje problem i wysyła zgłoszenie w kilkanaście sekund. Żadnych telefonów, żadnych arkuszy Excel.",
  },
  {
    icon: LayoutDashboard,
    title: "Pełna kontrola w panelu",
    description:
      "Wszystkie zgłoszenia, historia awarii i status maszyn w jednym miejscu. Reaguj szybciej i planuj przeglądy z wyprzedzeniem.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            Jak to działa
          </span>
          <h2 className="text-3xl font-semibold text-gray-900 leading-tight mb-4">
            Zarządzanie awariami nigdy nie było prostsze
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Asseto łączy pracowników z obsługą techniczną w kilka sekund — bez
            aplikacji, bez rejestracji.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="relative bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-200"
            >
              {/* Number */}
              <span className="absolute top-5 right-5 text-xs font-mono text-gray-200 font-bold">
                0{i + 1}
              </span>

              {/* Icon */}
              <div className="w-10 h-10 bg-blue-50 rounded-sm flex items-center justify-center mb-5 transition-colors">
                <card.icon size={20} className="text-blue-600" />
              </div>

              <h3 className="text-gray-900 font-medium text-lg mb-2">
                {card.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
