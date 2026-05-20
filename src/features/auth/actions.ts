import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { createSupabaseClient } from '@/lib/supabase'
import { db } from '@/lib/db'
import { profiles, studentDetails, teacherDetails } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { FullUserProfile } from '@/types'

export const getServerUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<FullUserProfile | null> => {
    try {
      const supabase = createSupabaseClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) return null

      const result = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, user.id))
        .leftJoin(studentDetails, eq(profiles.id, studentDetails.profileId))
        .leftJoin(teacherDetails, eq(profiles.id, teacherDetails.profileId))
        .limit(1)

      if (result.length === 0) return null

      const row = result[0]

      return {
        ...row.profiles,
        student: row.student_details,
        teacher: row.teacher_details,
      }
    } catch (error) {
      console.error('Error getting the user:', error)
      throw error
    }
  },
)

export const logoutFn = createServerFn().handler(async () => {
  const supabase = createSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      error: true,
      message: error.message,
    }
  }

  throw redirect({
    to: '/login',
    viewTransition: { types: [] },
  })
})
