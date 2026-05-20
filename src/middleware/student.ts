import { createMiddleware } from '@tanstack/react-start'
import { authMiddleware } from './auth'

export const studentMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (context.user?.role !== 'student') {
      throw new Error('Forbidden: Student access required')
    }
    return next()
  })
