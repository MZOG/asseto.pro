import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/logowanie')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="px-5 mx-auto max-w-5xl">
      {/* <div className="flex flex-col items-center justify-center max-w-md mx-auto">
        <h1 className="font-display leading-12 font-bold text-4xl text-center mb-5  bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
          Zaloguj się
        </h1>
        <p className="text-center text-muted-foreground">
          Zaloguj się, aby zarządzać maszynami i awariami.
        </p>
      </div> */}

      <div className="flex justify-center mt-5">
        <SignIn signUpUrl="/rejestracja" fallbackRedirectUrl={'/dashboard'} />
      </div>

      {/* <div className="bg-white rounded-xl border max-w-sm p-5 mx-auto mt-8">
        <Button variant="outline" className="w-full">
          Zaloguj się przez Google
        </Button>
        <Separator className="my-5" />

        <form className="space-y-4">
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

          <Button className="w-full">Zaloguj się</Button>

          <div className="flex justify-center flex-col items-center text-sm text-muted-foreground">
            <Link
              to="/reset-password"
              className="text-primary hover:underline mb-3"
            >
              Zapomniałeś hasła?
            </Link>
            <p>
              Nie masz konta?{' '}
              <Link to="/rejestracja" className="text-primary hover:underline">
                Zarejestruj się
              </Link>
            </p>
          </div>
        </form>
      </div> */}
    </section>
  )
}
