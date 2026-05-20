import { createServerFn } from '@tanstack/react-start'
import { tutorMiddleware } from '#/middleware/tutor'
import { db } from '#/lib/db'
import { lessons } from '#/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const getTutorCourses = createServerFn({ method: 'GET' })
  .middleware([tutorMiddleware])
  .handler(async ({ context }) => {
    const currentUserId = context.user.id

    const data = await db.query.courses.findMany({
      where: (courses, { eq }) => eq(courses.teacherId, currentUserId),
    })

    return data ?? []
  })

export const getCourseEditorDetails = createServerFn({ method: 'GET' })
  .middleware([tutorMiddleware])
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const data = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.slug, slug),
      with: {
        units: {
          orderBy: (u, { asc }) => [asc(u.order)],
          with: {
            lessons: {
              orderBy: (l, { asc }) => [asc(l.order)],
              with: {
                assessments: true,
              },
            },
          },
        },
      },
    })

    if (!data) throw new Error('Curso no encontrado')
    return data
  })

const lessonParamsSchema = z.object({
  lessonSlug: z.string(),
})

export const getLessonFn = createServerFn({ method: 'GET' })
  .middleware([tutorMiddleware])
  .inputValidator((data) => lessonParamsSchema.parse(data))
  .handler(async ({ data: { lessonSlug } }) => {
    const lesson = await db.query.lessons.findFirst({
      where: (lessons, { eq }) => eq(lessons.slug, lessonSlug),
    })

    if (!lesson) return { success: false, error: 'lesson not found' }

    return { success: true, data: lesson }
  })

export const updateLessonContent = createServerFn({ method: 'POST' })
  .middleware([tutorMiddleware])
  .inputValidator((data: { id: string; content: string }) => data)
  .handler(async ({ data }) => {
    await db
      .update(lessons)
      .set({ content: data.content })
      .where(eq(lessons.id, data.id))

    return { success: true }
  })
