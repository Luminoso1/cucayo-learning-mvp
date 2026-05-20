import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '@/middleware/auth'
import { studentMiddleware } from '@/middleware/student'
import { db } from '@/lib/db'
import { enrollments, courses, units, lessons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const getDashboardFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, studentMiddleware])
  .handler(async ({ context }) => {
    const currentUserId = context.user.id

    const studentDashboardData = await db
      .select({
        id: courses.id,
        courseSlug: courses.slug,
        name: courses.name,
        description: courses.description,
        icon: courses.icon,
        theme: courses.theme,
        status: enrollments.status,
        progress: enrollments.progress,
        remainingMinutes: enrollments.remainingMinutes,
        xp: courses.xp,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.studentId, currentUserId))

    return studentDashboardData
  })

export const getCourseDetailFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, studentMiddleware])
  .inputValidator((courseSlug: string) => courseSlug)
  .handler(async ({ data: courseSlug, context }) => {
    const studentId = context.user.id

    const detail = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.slug, courseSlug),
      with: {
        enrollments: {
          where: (enrollments, { eq }) => eq(enrollments.studentId, studentId),
        },
        units: {
          orderBy: (units, { asc }) => [asc(units.order)],
          with: {
            lessons: {
              orderBy: (lessons, { asc }) => [asc(lessons.order)],
              with: {
                completions: {
                  where: (comp, { eq }) => eq(comp.studentId, studentId),
                },
              },
            },
          },
        },
      },
    })

    if (!detail) throw new Error('Course not found')

    let lastLessonCompleted = true

    const unitsWithStatus = detail.units.map((unit) => ({
      id: unit.id,
      title: unit.title,
      order: unit.order,
      lessons: unit.lessons.map((lesson) => {
        const isCompleted = lesson.completions.length > 0
        const isLocked = !lastLessonCompleted

        lastLessonCompleted = isCompleted

        return {
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          isCompleted,
          isLocked,
        }
      }),
    }))

    return {
      course: detail,
      enrollment: detail.enrollments[0] ?? null,
      units: unitsWithStatus ?? [],
    }
  })
