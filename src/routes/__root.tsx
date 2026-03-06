import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import type { User, SupabaseClient } from '@supabase/supabase-js'
import appCss from '../styles.css?url'
import { getBrowserClient, getSupabaseServerClient } from '@/utils/supabase'

interface MyRouterContext {
  queryClient: QueryClient
  supabase: any
  user: User | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const client =
      typeof window === 'undefined'
        ? await getSupabaseServerClient()
        : getBrowserClient()

    const { data } = await client.auth.getSession()
    console.log(data)

    return {
      user: data.session?.user ?? null,
    }
  },

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Jedno skanowanie. Zero problemów.' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="pl">
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-50/95">
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
