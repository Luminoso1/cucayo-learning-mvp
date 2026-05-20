import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import {
  QueryClient,
  MutationCache,
  matchQuery,
  type QueryKey,
} from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidates?: Array<
        | QueryKey
        | ((data: unknown, variables: unknown, context: unknown) => QueryKey)
      >
    }
  }
}

function getRouterContext() {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (data, variables, context, mutation) => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            // invalidate all matching tags at once
            // or everything if no meta is provided
            mutation.meta?.invalidates?.some((queryKey) => {
              if (typeof queryKey === 'function') {
                return matchQuery(
                  { queryKey: queryKey(data, variables, context) },
                  query,
                )
              }

              return matchQuery({ queryKey }, query)
            }) ?? true,
        })
      },
    }),
  })

  return {
    queryClient,
    user: null,
  }
}

export function getRouter() {
  const context = getRouterContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({
    queryClient: context.queryClient,
    router,
    wrapQueryClient: true,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
