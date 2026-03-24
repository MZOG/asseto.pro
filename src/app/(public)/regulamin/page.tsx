import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin",
  description: "Regulamin serwisu Asseto — warunki korzystania z usługi.",
  robots: { index: false, follow: false },
};

export default function Regulamin() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Regulamin serwisu
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
              1. Postanowienia ogólne
            </h2>
            <p>
              Niniejszy regulamin określa zasady korzystania z serwisu Asseto,
              dostępnego pod adresem asseto.pro. Korzystając z serwisu,
              akceptujesz niniejszy regulamin w całości.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. Definicje
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Serwis</strong> — platforma Asseto dostępna pod adresem
                asseto.pro
              </li>
              <li>
                <strong>Użytkownik</strong> — osoba fizyczna lub prawna
                korzystająca z serwisu
              </li>
              <li>
                <strong>Konto</strong> — indywidualne konto użytkownika w
                serwisie
              </li>
              <li>
                <strong>Plan</strong> — wybrany przez użytkownika pakiet usług
                (Darmowy lub Pro)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. Rejestracja i konto
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Rejestracja wymaga podania adresu e-mail i hasła</li>
              <li>
                Użytkownik jest odpowiedzialny za bezpieczeństwo swojego hasła
              </li>
              <li>Jedno konto może być używane przez jedną osobę</li>
              <li>Zabrania się udostępniania konta osobom trzecim</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. Plany i płatności
            </h2>
            <p className="mb-2">
              <strong>Plan Darmowy:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Do 10 urządzeń</li>
              <li>Podstawowe funkcje zgłaszania usterek</li>
              <li>Bezterminowy, bez karty kredytowej</li>
            </ul>
            <p className="mb-2">
              <strong>Plan Pro:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Nielimitowane urządzenia i wszystkie funkcje</li>
              <li>Opłata miesięczna zgodna z aktualnym cennikiem</li>
              <li>Rozliczenie przez Stripe — płatność kartą</li>
              <li>Możliwość anulowania w dowolnym momencie</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Anulowanie subskrypcji
            </h2>
            <p>
              Subskrypcję Pro możesz anulować w dowolnym momencie z poziomu
              panelu. Dostęp do funkcji Pro pozostaje aktywny do końca
              opłaconego okresu. Nie zwracamy opłat za niewykorzystany czas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Zasady korzystania
            </h2>
            <p>Zabrania się:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Używania serwisu w sposób niezgodny z prawem</li>
              <li>Wprowadzania fałszywych danych</li>
              <li>Prób obejścia zabezpieczeń serwisu</li>
              <li>Używania serwisu do wysyłania spamu</li>
              <li>Kopiowania lub modyfikowania kodu serwisu</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Dostępność serwisu
            </h2>
            <p>
              Staramy się zapewnić ciągłość działania serwisu, jednak nie
              gwarantujemy dostępności przez 100% czasu. Zastrzegamy sobie prawo
              do przerw technicznych, które będziemy komunikować z
              wyprzedzeniem.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              8. Dane użytkownika
            </h2>
            <p>
              Użytkownik jest właścicielem danych wprowadzanych do serwisu.
              Zobowiązujemy się nie sprzedawać danych użytkowników osobom
              trzecim. Szczegóły przetwarzania danych opisuje{" "}
              <a
                href="/polityka-prywatnosci"
                className="text-blue-600 hover:text-blue-700"
              >
                Polityka prywatności
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              9. Usunięcie konta
            </h2>
            <p>
              Możesz usunąć konto w dowolnym momencie kontaktując się pod
              adresem{" "}
              <a
                href="mailto:marcin@asseto.pro"
                className="text-blue-600 hover:text-blue-700"
              >
                marcin@asseto.pro
              </a>
              . Po usunięciu konta wszystkie dane zostaną skasowane w ciągu 30
              dni.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              10. Odpowiedzialność
            </h2>
            <p>
              Serwis Asseto jest narzędziem wspierającym zarządzanie usterkami.
              Nie ponosimy odpowiedzialności za szkody wynikające z opóźnień w
              zgłaszaniu lub naprawie usterek. Użytkownik korzysta z serwisu na
              własną odpowiedzialność.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              11. Zmiany regulaminu
            </h2>
            <p>
              Zastrzegamy sobie prawo do zmiany regulaminu. O istotnych zmianach
              poinformujemy e-mailem z 14-dniowym wyprzedzeniem. Dalsze
              korzystanie z serwisu po wejściu zmian w życie oznacza ich
              akceptację.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              12. Kontakt
            </h2>
            <p>
              W sprawach dotyczących regulaminu:{" "}
              <a
                href="mailto:marcin@asseto.pro"
                className="text-blue-600 hover:text-blue-700"
              >
                marcin@asseto.pro
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
