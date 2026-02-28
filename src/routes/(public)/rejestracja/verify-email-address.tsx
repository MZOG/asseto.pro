import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(public)/rejestracja/verify-email-address',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="mx-auto px-5 max-w-lg">
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-center">
        <p className="text-sm font-medium text-blue-600 text-balance">
          Dziękujemy za rejestrację! Sprawdź swoją skrzynkę e-mail, aby
          zweryfikować adres e-mail.
        </p>
      </div>
      <div className="flex items-center justify-center mt-5">
        <Button asChild>
          <Link to="/logowanie">Przejdź do logowania</Link>
        </Button>
      </div>
    </section>
  )
}
