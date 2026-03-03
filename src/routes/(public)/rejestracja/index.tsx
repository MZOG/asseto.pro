import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getSupabaseClient, supabase } from '@/utils/supabase'

export const Route = createFileRoute('/(public)/rejestracja/')({
  beforeLoad: async () => {
    if (typeof window === 'undefined') {
      return
    }

    const client = getSupabaseClient()
    const { data } = await client.auth.getSession()

    if (data.session) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Hasła muszą być takie same.')
      return
    }

    if (!companyName.trim()) {
      setError('Nazwa firmy jest wymagana.')
      return
    }

    setIsSubmitting(true)

    const normalizedEmail = email.trim().toLowerCase()

    const emailRedirectTo =
      typeof window === 'undefined'
        ? undefined
        : `${window.location.origin}/logowanie`

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
        data: { company_name: companyName.trim() },
      },
    })

    if (signUpError) {
      setIsSubmitting(false)
      setError(signUpError.message)
      return
    }

    if (data.user?.id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: data.user.id,
            email: normalizedEmail,
            company_name: companyName.trim(),
          },
          { onConflict: 'id' },
        )

      if (profileError) {
        console.error('Nie udało się utworzyć profilu po rejestracji:', profileError)
      }
    }

    setIsSubmitting(false)

    if (data.session) {
      navigate({ to: '/dashboard' })
      return
    }

    navigate({ to: '/rejestracja/verify-email-address' })
  }

  return (
    <section className="px-5 mx-auto max-w-5xl">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
        <h1 className="font-display leading-12 font-bold text-4xl text-center mb-5 bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
          Załóż konto
        </h1>
        <p className="text-center text-muted-foreground">
          Stwórz konto i zacznij zarządzać awariami.
        </p>
      </div>

      <div className="bg-white rounded-xl border max-w-sm p-5 mx-auto mt-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="companyName">
              Nazwa firmy
            </label>
            <Input
              className="bg-white h-10"
              id="companyName"
              type="text"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              autoComplete="organization"
              placeholder="np. Fit Factory"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm" htmlFor="email">
              E-mail
            </label>
            <Input
              className="bg-white h-10"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="jan@firma.pl"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm" htmlFor="password">
              Hasło
            </label>
            <Input
              className="bg-white h-10"
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm" htmlFor="confirmPassword">
              Powtórz hasło
            </label>
            <Input
              className="bg-white h-10"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Tworzenie konta...' : 'Załóż konto'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Masz już konto?{' '}
            <Link to="/logowanie" className="text-primary hover:underline">
              Zaloguj się
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}
