import { createServerFn } from '@tanstack/react-start'
import { studentMiddleware } from '#/middleware/student'
import { db } from '#/lib/db'

export const getAssessmentByLessonSlugFn = createServerFn({ method: 'GET' })
  .middleware([studentMiddleware])
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const lessonData = await db.query.lessons.findFirst({
      where: (lessons, { eq }) => eq(lessons.slug, slug),
      with: {
        assessments: {
          with: {
            assessmentQuestions: {
              orderBy: (aq, { asc }) => [asc(aq.order)],
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
        },
      },
    })

    if (!lessonData || !lessonData.assessments?.[0]) {
      throw new Error('No se encontró el examen.')
    }

    return lessonData.assessments[0]
  })
