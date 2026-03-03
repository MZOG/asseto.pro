import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Brak konfiguracji Supabase. Ustaw VITE_SUPABASE_URL i VITE_SUPABASE_KEY w .env.local',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const createClientBrowser = () =>
  createClient(supabaseUrl, supabaseAnonKey)

export const getSupabaseClient = (): SupabaseClient => supabase
