import { useMutation } from '@tanstack/react-query'
import type {
  Session,
  SignInWithPasswordCredentials,
  User,
  WeakPassword,
} from '@supabase/supabase-js'
import { createSupabaseClient } from '@/lib/supabase'
import { userQueryKey } from '@/features/auth/queries'

interface Props {
  onSuccess?: VoidFunction
  onError?: (error: Error) => void
}

export interface SignInSuccessData {
  user: User
  session: Session
  weakPassword?: WeakPassword
}

export const useSignIn = ({ onSuccess, onError }: Props) => {
  const supabase = createSupabaseClient()

  const mutationFn = async (
    credentials: SignInWithPasswordCredentials,
  ): Promise<SignInSuccessData> => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials)

    if (error) {
      throw error
    }

    return data
  }

  return useMutation({
    mutationFn,
    onSuccess,
    onError,
    meta: { invalidates: [userQueryKey] },
  })
}
