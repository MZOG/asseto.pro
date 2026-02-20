import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/kontakt')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="px-5 mx-auto max-w-3xl">
      <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
        <h1 className="font-display font-bold text-4xl text-center mb-5 bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
          Kontakt
        </h1>
        <p className="text-center text-muted-foreground">
          Masz pytania? Napisz do nas - odpowiemy najszybciej jak to możliwe.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-3 ">
          <div>
            <p className="text-sm font-medium">Email:</p>
            <a
              href="mailto:kontakt@asseto.pl"
              className="text-blue-500 hover:underline"
            >
              kontakt@asseto.pl
            </a>
          </div>

          <div>
            <p className="text-sm font-medium">Telefon:</p>
            <a href="tel:739907919" className="text-blue-500 hover:underline">
              +48 739 907 919
            </a>
          </div>
        </div>

        <div>
          <form action="" className="space-y-3">
            <Field className="gap-2">
              <FieldLabel htmlFor="input-demo-api-key">
                Imię i nazwisko
              </FieldLabel>
              <Input
                className="bg-white h-10"
                id="input-demo-api-key"
                type="password"
                placeholder="Jan Kowalski"
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="input-demo-api-key">E-mail</FieldLabel>
              <Input
                className="bg-white h-10"
                id="input-demo-api-key"
                type="email"
                placeholder="jan@firma.pl"
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="input-demo-api-key">Firma</FieldLabel>
              <Input
                className="bg-white h-10"
                id="input-demo-api-key"
                type="email"
                placeholder="Nazwa firmy (opcjonalnie)"
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="input-demo-api-key">Firma</FieldLabel>
              <Textarea
                placeholder="W czym możemy pomóc?"
                className="bg-white resize-none min-h-30"
                cols={10}
              />
            </Field>

            <Button>Wyślij wiadomość</Button>
          </form>
        </div>
      </div>
    </section>
  )
}
