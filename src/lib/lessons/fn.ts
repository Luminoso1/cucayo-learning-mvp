import { createServerFn } from '@tanstack/react-start'
import { studentMiddleware } from '@/middleware/student'
import { db } from '@/lib/db'
import { z } from 'zod'

const lessonParamsSchema = z.object({
  lessonSlug: z.string(),
})

export const getLessonFn = createServerFn({ method: 'GET' })
  .middleware([studentMiddleware])
  .inputValidator((data) => lessonParamsSchema.parse(data))
  .handler(async ({ data: { lessonSlug } }) => {
    const lesson = await db.query.lessons.findFirst({
      where: (lessons, { eq }) => eq(lessons.slug, lessonSlug),
    })

    if (!lesson) return { success: false, error: 'lesson not found' }

    return { success: true, data: lesson }
  })
