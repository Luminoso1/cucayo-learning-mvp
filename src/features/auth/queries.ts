import { queryOptions } from '@tanstack/react-query'
import { getServerUser } from './actions'

export const userQueryKey = ['user'] as const

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'teacher' | 'admin'
  student?: {
    careerName: string
    semester: number
  }
  teacher?: {
    specialty: string
  }
}

export const getCurrentUserQueryOptions = () => {
  return queryOptions({
    queryKey: userQueryKey,
    queryFn: async () => {
      const user = await getServerUser()
      return user
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}
