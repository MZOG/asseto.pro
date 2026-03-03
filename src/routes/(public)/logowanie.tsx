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

export const Route = createFileRoute('/(public)/logowanie')({
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
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate({ to: '/dashboard' })
  }

  return (
    <section className="px-5 mx-auto max-w-5xl">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
        <h1 className="font-display leading-12 font-bold text-4xl text-center mb-5 bg-linear-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
          Zaloguj się
        </h1>
        <p className="text-center text-muted-foreground">
          Zaloguj się, aby zarządzać maszynami i awariami.
        </p>
      </div>

      <div className="bg-white rounded-xl border max-w-sm p-5 mx-auto mt-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
          </Button>

          <div className="flex justify-center flex-col items-center text-sm text-muted-foreground">
            <Link
              to="/forgot-password"
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
      </div>
    </section>
  )
}
