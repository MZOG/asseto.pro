import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomoc i FAQ",
  description:
    "Odpowiedzi na najczęściej zadawane pytania dotyczące Asseto — jak działa system, kody QR, zgłoszenia, subskrypcja i bezpieczeństwo danych.",
  openGraph: {
    title: "Pomoc i FAQ — Asseto",
    description: "Znajdź odpowiedź na swoje pytanie lub skontaktuj się z nami.",
    url: "https://asseto.pro/pomoc",
    siteName: "Asseto",
    locale: "pl_PL",
    type: "website",
  },
};

const faqs = [
  {
    question: "Czym jest Asseto?",
    answer:
      "Asseto to system do zarządzania usterkami oparty o kody QR. Każde urządzenie lub obiekt otrzymuje naklejkę z kodem QR — wystarczy go zeskanować telefonem żeby zgłosić problem. Bez instalowania aplikacji, bez rejestracji.",
  },
  {
    question: "Kto może zgłosić usterkę?",
    answer:
      "Każda osoba która ma dostęp do kodu QR — niezależnie od tego czy to obiekt publiczny, siłownia, hotel, zakład produkcyjny czy cokolwiek innego. Formularz zgłoszenia jest dostępny bez logowania i działa na każdym smartfonie.",
  },
  {
    question: "Jak wygenerować kod QR dla urządzenia?",
    answer:
      "Po dodaniu urządzenia w panelu, kod QR jest generowany automatycznie. Możesz wybrać rozmiar wydruku (S, M, L, XL), pobrać gotowy PDF i nakleić na urządzenie. Każde urządzenie ma unikalny kod.",
  },
  {
    question: "Czy potrzebuję specjalnego sprzętu lub aplikacji?",
    answer:
      "Nie. Do zarządzania potrzebujesz tylko przeglądarki internetowej. Do skanowania kodów QR wystarczy aparat w smartfonie — standardowa kamera w iOS i Android obsługuje skanowanie bez dodatkowych aplikacji.",
  },
  {
    question: "Ile urządzeń mogę dodać?",
    answer:
      "W planie darmowym możesz dodać do 10 urządzeń. Plan Pro oferuje nielimitowaną liczbę urządzeń.",
  },
  {
    question: "Czy dostanę powiadomienie o nowym zgłoszeniu?",
    answer:
      "Tak — po każdym nowym zgłoszeniu na adres e-mail przypisany do konta wysyłane jest powiadomienie z opisem problemu, nazwą urządzenia i linkiem do panelu.",
  },
  {
    question: "Jak działają statusy zgłoszeń?",
    answer:
      "Każde zgłoszenie ma jeden z trzech statusów: Uszkodzone (nowe zgłoszenie wymagające interwencji), W serwisie (problem w trakcie naprawy) oraz Zamknięte (naprawa zakończona). Zmiana statusu automatycznie aktualizuje też status urządzenia.",
  },
  {
    question: "Czy mogę przypisać serwisanta do urządzenia?",
    answer:
      "Tak — każde urządzenie może mieć przypisany numer telefonu i adres e-mail serwisanta. Z poziomu zgłoszenia możesz wysłać do niego gotową wiadomość e-mail z opisem problemu jednym kliknięciem. Funkcja dostępna w planie Pro.",
  },
  {
    question: "Czym różni się plan darmowy od Pro?",
    answer:
      "Plan darmowy pozwala zarządzać do 10 urządzeniami i obsługiwać zgłoszenia przez QR. Plan Pro oferuje nielimitowane urządzenia, powiadomienia e-mail do serwisanta, edycję etykiet kodów QR, eksport danych do CSV i PDF oraz priorytetowe wsparcie.",
  },
  {
    question: "Jak anulować subskrypcję?",
    answer:
      "Subskrypcję możesz anulować w dowolnym momencie z poziomu panelu w sekcji Ustawienia → Subskrypcja. Dostęp do planu Pro pozostaje aktywny do końca opłaconego okresu rozliczeniowego.",
  },
  {
    question: "Czy moje dane są bezpieczne?",
    answer:
      "Tak. Dane przechowujemy na serwerach Supabase z szyfrowaniem. Płatności obsługuje Stripe — nie przechowujemy danych kart płatniczych. Każdy użytkownik ma dostęp wyłącznie do swoich urządzeń i zgłoszeń.",
  },
  {
    question: "Mam pytanie którego tu nie ma — co robię?",
    answer:
      "Napisz do nas przez stronę Kontakt lub bezpośrednio na marcin@asseto.pro. Odpowiadamy w ciągu 24 godzin.",
  },
];

export default function PomocPage() {
  return (
    <div className="pt-14 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            Pomoc
          </span>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Często zadawane pytania
          </h1>
          <p className="text-gray-500 text-base">
            Nie znalazłeś odpowiedzi?{" "}
            <a
              href="/kontakt"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Napisz do nas
            </a>
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-white border border-gray-200 rounded-xl px-5 data-[state=open]:border-blue-200"
            >
              <AccordionTrigger className="text-sm font-medium text-gray-900 hover:no-underline py-4 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-500 leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
