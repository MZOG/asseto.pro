import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import { supabase } from '@/utils/supabase'
import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: {
      queryClient: rqContext.queryClient,
      supabase,
      user: null,
    },
    defaultPreload: false,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  })

  return router
}
