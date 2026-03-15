import PageHeader from "@/components/panel/page-header";
import {
  TriangleAlert,
  Wrench,
  CheckCheck,
  QrCode,
  RefreshCw,
  Bell,
} from "lucide-react";

const sections = [
  {
    icon: QrCode,
    iconClass: "text-blue-600 bg-blue-50",
    question: "Jak pracownik zgłasza awarię?",
    answer:
      'Każda maszyna ma naklejkę z kodem QR. Pracownik skanuje kod aparatem telefonu — bez instalowania aplikacji, bez logowania. Otwiera się formularz gdzie opisuje usterkę i klika "Zgłoś". Zgłoszenie pojawia się natychmiast w Twoim panelu.',
  },
  {
    icon: TriangleAlert,
    iconClass: "text-red-600 bg-red-50",
    question: "Co oznaczają statusy awarii?",
    answer: null,
    statuses: [
      {
        label: "Uszkodzona",
        color: "bg-red-100 text-red-700",
        desc: "Nowe zgłoszenie — maszyna wymaga naprawy.",
      },
      {
        label: "W serwisie",
        color: "bg-yellow-100 text-yellow-700",
        desc: "Usterka jest w trakcie naprawy.",
      },
      {
        label: "Zamknięta",
        color: "bg-gray-100 text-gray-600",
        desc: "Naprawa zakończona, maszyna sprawna.",
      },
    ],
  },
  {
    icon: RefreshCw,
    iconClass: "text-yellow-600 bg-yellow-50",
    question: "Jak zmienić status awarii?",
    answer:
      'Wejdź w szczegóły awarii — w prawym górnym rogu strony znajdziesz rozwijane menu ze statusami. Zmiana statusu awarii automatycznie aktualizuje też status maszyny. Gdy zamkniesz awarię, maszyna wróci do statusu "Sprawna".',
  },
  {
    icon: Bell,
    iconClass: "text-purple-600 bg-purple-50",
    question: "Czy dostanę powiadomienie o nowej awarii?",
    answer:
      "Tak — po każdym nowym zgłoszeniu otrzymasz e-mail z opisem usterki, nazwą maszyny i linkiem do panelu. Upewnij się że masz poprawny adres e-mail w ustawieniach konta.",
  },
  {
    icon: Wrench,
    iconClass: "text-orange-600 bg-orange-50",
    question: "Jak poinformować serwisanta o awarii?",
    answer:
      'W widoku szczegółów awarii znajdziesz przycisk "Poinformuj serwis". Po kliknięciu pojawi się gotowa wiadomość e-mail z danymi maszyny i opisem usterki — możesz ją edytować przed wysłaniem. Funkcja dostępna w planie Pro.',
  },
  {
    icon: CheckCheck,
    iconClass: "text-green-600 bg-green-50",
    question: "Gdzie znajdę historię zamkniętych awarii?",
    answer:
      'W menu bocznym w sekcji "Awarie" masz zakładkę "Zamknięte" — tam znajdziesz wszystkie zakończone zgłoszenia. Możesz je przeglądać i sprawdzać kiedy zostały zamknięte.',
  },
];

export default function PomocAwariaPage() {
  return (
    <section>
      <PageHeader title="Pomoc — Awarie" />
      <p className="text-gray-500 text-sm mt-1 mb-8">
        Wszystko co musisz wiedzieć o zgłaszaniu i zarządzaniu awariami.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((s) => (
          <div
            key={s.question}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.iconClass}`}
              >
                <s.icon size={17} />
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
                        className="flex items-center gap-3"
                      >
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${status.color}`}
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
        ))}
      </div>
    </section>
  );
}
