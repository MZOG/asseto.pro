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

const sections = [
  {
    icon: Plus,
    iconClass: "text-blue-600 bg-blue-50",
    question: "Jak dodać nową maszynę?",
    answer:
      'W menu bocznym przejdź do "Maszyny" i kliknij przycisk "Dodaj maszynę". Wymagana jest tylko nazwa — numer seryjny jest opcjonalny. Po dodaniu zostaniesz przekierowany na stronę maszyny gdzie od razu możesz wygenerować kod QR.',
  },
  {
    icon: QrCode,
    iconClass: "text-blue-600 bg-blue-50",
    question: "Jak działa kod QR?",
    answer:
      "Każda maszyna ma unikalny kod QR który prowadzi do formularza zgłoszenia. Możesz wybrać rozmiar wydruku (S, M, L, XL), pobrać PDF i nakleić na maszynę. Kod można w każdej chwili wygenerować ponownie — stary przestaje działać.",
  },
  {
    icon: Fingerprint,
    iconClass: "text-purple-600 bg-purple-50",
    question: "Do czego służą własne pola?",
    answer:
      'Własne pola pozwalają dodać dowolne informacje do maszyny — np. "Rok produkcji", "Model silnika", "Ostatni przegląd". Każde pole ma nazwę i wartość. Możesz dodawać i usuwać je w dowolnym momencie.',
  },
  {
    icon: MapPin,
    iconClass: "text-green-600 bg-green-50",
    question: "Co to jest lokalizacja maszyny?",
    answer:
      'Lokalizacja to pole tekstowe opisujące gdzie fizycznie znajduje się maszyna — np. "Hala A, stanowisko 3" lub "Piętro 2, pokój 201". Pojawia się w szczegółach awarii, co ułatwia serwisantowi odnalezienie maszyny.',
  },
  {
    icon: Wrench,
    iconClass: "text-orange-600 bg-orange-50",
    question: "Jak ustawić dane serwisanta?",
    answer:
      'Możesz ustawić domyślny numer telefonu i e-mail serwisanta w Ustawieniach — zostanie automatycznie przypisany do każdej nowej maszyny. Możesz też nadpisać go per maszyna w zakładce "Serwisant" na stronie maszyny.',
  },
  {
    icon: Image,
    iconClass: "text-pink-600 bg-pink-50",
    question: "Jak dodać zdjęcie maszyny?",
    answer:
      'Na stronie maszyny w sekcji "Zdjęcie" kliknij "Dodaj zdjęcie". Obsługiwane formaty to JPG, PNG i WEBP. Zdjęcie pojawia się w szczegółach awarii co ułatwia identyfikację maszyny. Możesz je w każdej chwili zmienić lub usunąć.',
  },
  {
    icon: Trash2,
    iconClass: "text-red-600 bg-red-50",
    question: "Czy mogę usunąć maszynę?",
    answer:
      "Tak — na stronie maszyny w prawym górnym rogu znajdziesz przycisk usuwania (ikona kosza). Usunięcie maszyny jest nieodwracalne — razem z nią zostaną usunięte wszystkie powiązane awarie i dane. Upewnij się że na pewno chcesz to zrobić.",
  },
];

export default function PomocMaszynyPage() {
  return (
    <section className="max-w-2xl">
      <PageHeader title="Pomoc — Maszyny" />
      <p className="text-gray-500 text-sm mt-1 mb-8">
        Jak zarządzać maszynami, kodami QR i danymi technicznymi.
      </p>

      <div className="space-y-3">
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
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
