import { createServerFn } from '@tanstack/react-start'
import { studentMiddleware } from '@/middleware/student'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { assessments, courses } from '@/lib/db/schema'
import { z } from 'zod'

interface FormattedQuestion {
  id: string
  type:
    | 'multiple_choise'
    | 'ordering'
    | 'text_input'
    | 'cloze'
    | 'multiple_cloze'
  statement: string
  metadata: Record<string, any> | null
  points: number
  options: {
    id: string
    content: string
    isCorrect: boolean | null
    order: number | null
  }[]
}

interface AssessmentPayload {
  id: string
  title: string
  pointsToPass: number
  timeLimit: number
  questions: FormattedQuestion[]
}

const courseParamsSchema = z.object({
  courseSlug: z.string(),
})

export const getCourseAssessmentFn = createServerFn({
  method: 'GET',
})
  .middleware([studentMiddleware])
  .validator((data) => courseParamsSchema.parse(data))
  .handler(
    async ({ data: { courseSlug } }): Promise<AssessmentPayload | null> => {
      const targetCourse = await db.query.courses.findFirst({
        where: eq(courses.slug, courseSlug),
        columns: { id: true },
      })

      if (!targetCourse) {
        throw new Error(`Curso no encontrado para el slug: ${courseSlug}`)
      }

      const assessment = await db.query.assessments.findFirst({
        where: eq(assessments.courseId, targetCourse.id),
        with: {
          assessmentQuestions: {
            orderBy: (aq, { asc }) => [asc(aq.order)],
            with: {
              question: {
                with: {
                  options: {
                    orderBy: (qo, { asc }) => [asc(qo.order)],
                  },
                },
              },
            },
          },
        },
      })

      if (!assessment) {
        return null
      }

      const formattedQuestions: FormattedQuestion[] =
        assessment.assessmentQuestions.reduce<FormattedQuestion[]>(
          (acc, aq) => {
            if (!aq.question) return acc

            acc.push({
              id: aq.question.id,
              type: aq.question.type as
                | 'multiple_choise'
                | 'ordering'
                | 'text_input'
                | 'cloze'
                | 'multiple_cloze',
              statement: aq.question.statement,
              metadata: (aq.question.metadata as Record<string, any>) || null,
              points: aq.question.points ?? 0,
              options: aq.question.options.map((o) => ({
                id: o.id,
                content: o.content,
                isCorrect: o.isCorrect,
                order: o.order,
              })),
            })

            return acc
          },
          [],
        )

      return {
        id: assessment.id,
        title: assessment.title,
        pointsToPass: assessment.passingScore,
        timeLimit: assessment.timeLimit,
        questions: formattedQuestions,
      }
    },
  )
