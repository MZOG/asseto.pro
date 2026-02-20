import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/rejestracja')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="px-5 mx-auto max-w-5xl">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
        <h1 className="font-display leading-12 font-bold text-4xl text-center mb-5  bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
          Załóż konto firmy
        </h1>
        <p className="text-center text-muted-foreground">
          Stwórz nową organizację i zacznij zarządzać awariami w kilka minut.
        </p>
      </div>

      <div className="bg-white rounded-xl border max-w-sm p-5 mx-auto mt-8">
        <Button variant="outline" className="w-full">
          Zarejestruj się przez Google
        </Button>
        <Separator className="my-5" />

        <form className="space-y-4">
          <Field className="gap-2">
            <FieldLabel htmlFor="company_name">Nazwa firmy</FieldLabel>
            <Input
              className="bg-white h-10"
              id="company_name"
              type="text"
              placeholder="Firma Sp. z o.o."
            />
          </Field>

          <Field className="gap-2">
            <FieldLabel htmlFor="full_name">Imię i nazwisko</FieldLabel>
            <Input
              className="bg-white h-10"
              id="full_name"
              type="text"
              placeholder="Jan Kowalski"
            />
          </Field>

          <Field className="gap-2">
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              className="bg-white h-10"
              id="email"
              type="email"
              placeholder="jan@firma.pl"
            />
          </Field>

          <Field className="gap-2">
            <FieldLabel htmlFor="password">Hasło</FieldLabel>
            <Input
              className="bg-white h-10"
              id="password"
              type="password"
              placeholder="••••••••"
            />
          </Field>

          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
              <FieldLabel
                htmlFor="terms-checkbox-basic"
                className="font-normal text-xs text-left"
              >
                <Link
                  to="/regulamin"
                  className="text-muted-foreground hover:underline inline"
                >
                  Akceptuję{' '}
                  <span className="text-primary">
                    regulamin serwisu i politykę prywatności
                  </span>
                </Link>
              </FieldLabel>
            </Field>
          </FieldGroup>

          <Button className="w-full">Załóż konto</Button>

          <div className="flex justify-center text-sm text-muted-foreground">
            <p>
              Masz już konto?{' '}
              <Link to="/logowanie" className="text-primary hover:underline">
                Zaloguj się
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
