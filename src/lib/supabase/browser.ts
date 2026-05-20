import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url({ message: 'Invalid Supabase URL' }),
  VITE_SUPABASE_KEY: z.string().min(10),
})

const env = envSchema.parse(import.meta.env)

export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_KEY
  )
}
