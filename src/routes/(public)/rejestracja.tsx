import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { GoogleOneTap, SignIn, SignUp } from '@clerk/tanstack-react-start'
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

      <div className="flex justify-center mt-8">
        <SignUp />
      </div>
    </section>
  )
}
