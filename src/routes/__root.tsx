import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
} from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'
// import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { SupabaseClient, Session } from '@supabase/supabase-js'

interface MyRouterContext {
  queryClient: QueryClient
  supabase: SupabaseClient
  session: Session | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Jedno skanowanie. Zero problemów.' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootDocument, // Zmieniono z shellComponent na component dla lepszej kontroli renderowania
})

function RootDocument() {
  return (
    <html lang="pl">
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-50/95">
        <Outlet />

        {/* <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        /> */}
        <Scripts />
      </body>
    </html>
  )
}
