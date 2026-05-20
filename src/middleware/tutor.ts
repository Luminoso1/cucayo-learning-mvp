import { createMiddleware } from '@tanstack/react-start'
import { authMiddleware } from './auth'

export const tutorMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (context.user?.role !== 'teacher') {
      throw new Error('Forbidden: Tutor access required')
    }
    return next()
  })


