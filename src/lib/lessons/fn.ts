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
      where: (lesson, { eq }) => eq(lesson.slug, lessonSlug),
      with: {
        blocks: {
          orderBy: (blocks, { asc }) => [asc(blocks.order)],
          with: {
            question: {
              with: {
                options: {
                  columns: {
                    id: true,
                    content: true,
                    order: true,
                    isCorrect: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!lesson || !lesson.blocks?.[0]) {
      return { success: false, error: 'lesson not found' }
    }

    return { success: true, data: lesson }
  })
