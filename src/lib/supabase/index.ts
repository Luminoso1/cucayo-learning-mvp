import { createIsomorphicFn } from '@tanstack/react-start'
import { createBrowserSupabaseClient } from './browser'
import { createServerSupabaseClient } from './server'

export const createSupabaseClient = createIsomorphicFn()
  .server(createServerSupabaseClient)
  .client(createBrowserSupabaseClient)

export type SupabaseClient = ReturnType<typeof createSupabaseClient>
