import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności serwisu Asseto — jak przetwarzamy Twoje dane osobowe.",
  robots: { index: false, follow: false },
};

export default function PolitykaPrywatnosci() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Polityka prywatności
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Ostatnia aktualizacja:{" "}
          {new Date().toLocaleDateString("pl-PL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Administrator danych
            </h2>
            <p>
              Administratorem Twoich danych osobowych jest właściciel serwisu
              Asseto, dostępnego pod adresem asseto.pro. W sprawach dotyczących
              danych osobowych możesz kontaktować się pod adresem:{" "}
              <a
                href="mailto:marcin@asseto.pro"
                className="text-blue-600 hover:text-blue-700"
              >
                marcin@asseto.pro
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. Jakie dane zbieramy
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Adres e-mail — przy rejestracji i logowaniu</li>
              <li>
                Imię i nazwisko, nazwa firmy, numer telefonu — podawane
                dobrowolnie w profilu
              </li>
              <li>
                Dane dotyczące maszyn i zgłoszeń — wprowadzane przez użytkownika
              </li>
              <li>
                Adres IP i dane techniczne — automatycznie przy korzystaniu z
                serwisu
              </li>
              <li>
                Dane płatności — przetwarzane przez Stripe (nie przechowujemy
                danych kart)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. Cel przetwarzania danych
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Świadczenie usług serwisu Asseto</li>
              <li>Obsługa konta użytkownika i subskrypcji</li>
              <li>
                Wysyłanie powiadomień e-mail związanych z korzystaniem z serwisu
              </li>
              <li>Obsługa płatności i fakturowania</li>
              <li>Kontakt w sprawach technicznych i wsparcia</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. Podstawa prawna
            </h2>
            <p>Przetwarzamy Twoje dane na podstawie:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                Art. 6 ust. 1 lit. b RODO — wykonanie umowy (świadczenie usług)
              </li>
              <li>Art. 6 ust. 1 lit. a RODO — Twoja zgoda (np. newsletter)</li>
              <li>
                Art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes
                administratora
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Przekazywanie danych
            </h2>
            <p>Twoje dane mogą być przekazywane zaufanym podwykonawcom:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>Supabase</strong> — przechowywanie danych i autoryzacja
              </li>
              <li>
                <strong>Stripe</strong> — obsługa płatności
              </li>
              <li>
                <strong>Resend</strong> — wysyłanie wiadomości e-mail
              </li>
              <li>
                <strong>Vercel</strong> — hosting aplikacji
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Okres przechowywania
            </h2>
            <p>
              Przechowujemy Twoje dane przez czas korzystania z serwisu oraz
              przez okres wymagany przepisami prawa (np. dokumenty księgowe — 5
              lat). Po usunięciu konta dane są kasowane w ciągu 30 dni.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Twoje prawa
            </h2>
            <p>Masz prawo do:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Dostępu do swoich danych</li>
              <li>Sprostowania nieprawidłowych danych</li>
              <li>Usunięcia danych ("prawo do bycia zapomnianym")</li>
              <li>Ograniczenia przetwarzania</li>
              <li>Przenoszenia danych</li>
              <li>Wniesienia sprzeciwu</li>
              <li>Cofnięcia zgody w dowolnym momencie</li>
            </ul>
            <p className="mt-3">
              Aby skorzystać z powyższych praw, skontaktuj się pod adresem:{" "}
              <a
                href="mailto:marcin@asseto.pro"
                className="text-blue-600 hover:text-blue-700"
              >
                marcin@asseto.pro
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              8. Pliki cookie
            </h2>
            <p>
              Serwis używa plików cookie niezbędnych do działania (sesja
              użytkownika). Nie używamy plików cookie śledzących ani
              reklamowych.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              9. Kontakt
            </h2>
            <p>
              W sprawach dotyczących ochrony danych osobowych możesz kontaktować
              się pod adresem:{" "}
              <a
                href="mailto:marcin@asseto.pro"
                className="text-blue-600 hover:text-blue-700"
              >
                marcin@asseto.pro
              </a>
            </p>
            <p className="mt-2">
              Masz również prawo wnieść skargę do Prezesa Urzędu Ochrony Danych
              Osobowych (uodo.gov.pl).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
