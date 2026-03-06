import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
} from '@supabase/ssr'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export function getBrowserClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_KEY!,
  )
}

export async function getSupabaseServerClient() {
  const { getRequest } = await import('@tanstack/react-start/server')
  const request = getRequest()

  return createServerClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          if (!request) return []
          return parseCookieHeader(request.headers.get('Cookie') ?? '').filter(
            (c): c is { name: string; value: string } => c.value !== undefined,
          )
        },
        setAll() {},
      },
    },
  )
}

// Używaj tego wszędzie w komponentach/handlerach (po stronie klienta)
export const supabase = {
  auth: {
    getSession: () => getBrowserClient().auth.getSession(),
    signOut: () => getBrowserClient().auth.signOut(),
    signInWithPassword: (credentials: { email: string; password: string }) =>
      getBrowserClient().auth.signInWithPassword(credentials),
    onAuthStateChange: (
      callback: (event: AuthChangeEvent, session: Session | null) => void,
    ) => getBrowserClient().auth.onAuthStateChange(callback),
  },
  from: (relation: string) => getBrowserClient().from(relation),
}

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return getSupabaseServerClient()
  }
  return getBrowserClient()
}

export const getClient = () => getBrowserClient()
