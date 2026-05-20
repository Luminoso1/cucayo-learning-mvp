import type { InferSelectModel } from 'drizzle-orm'
import { profiles, studentDetails, teacherDetails } from '@/lib/db/schema'

export type Profile = InferSelectModel<typeof profiles>
export type Student = InferSelectModel<typeof studentDetails>
export type Teacher = InferSelectModel<typeof teacherDetails>

export type FullUserProfile = Profile & {
  student: Student | null
  teacher: Teacher | null
}
