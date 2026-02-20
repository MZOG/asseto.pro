import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="border-t mt-20">
      <div className="max-w-6xl mx-auto px-5 py-10 ">
        <div className="grid grid-cols-4 gap-5">
          <div>
            <p className="font-semibold">Asseto</p>
            <p className="text-sm text-muted-foreground mt-4">
              Prosty system do zarządzania maszynami, awariami oraz usterkami.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Produkt</h4>
            <ul className="mt-4">
              <li>
                <Link
                  className="text-sm text-muted-foreground hover:text-primary"
                  to="/funkcje"
                >
                  Funkcje
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-muted-foreground hover:text-primary"
                  to="/cennik"
                >
                  Cennik
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium">Firma</h4>
            <ul className="mt-4">
              <li>
                <Link
                  className="text-sm text-muted-foreground hover:text-primary"
                  to="/kontakt"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-muted-foreground hover:text-primary"
                  to="/regulamin"
                >
                  Regulamin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium">Konto</h4>
            <ul className="mt-4">
              <li>
                <Link
                  className="text-sm text-muted-foreground hover:text-primary"
                  to="/logowanie"
                >
                  Zaloguj się
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-muted-foreground hover:text-primary"
                  to="/rejestracja"
                >
                  Rejestracja
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between border-t mt-10 pt-5">
          <p className="text-sm text-muted-foreground">
            © 2026 Asseto. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Linked</p>
        </div>
      </div>
    </footer>
  )
}
