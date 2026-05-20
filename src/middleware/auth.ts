import { createMiddleware } from '@tanstack/react-start'
import { getServerUser } from '@/features/auth/actions'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getServerUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return next({ context: { user } })
})
