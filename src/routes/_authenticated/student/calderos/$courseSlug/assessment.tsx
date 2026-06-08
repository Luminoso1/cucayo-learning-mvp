import { createFileRoute } from '@tanstack/react-router'
import { getCourseAssessmentFn } from '#/lib/assessment/fn'
import AssessmentStepper from '#/components/assessment/stepper'

export const Route = createFileRoute(
  '/_authenticated/student/calderos/$courseSlug/assessment',
)({
  loader: async ({ params: { courseSlug } }) => {
    return await getCourseAssessmentFn({ data: { courseSlug } })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { courseSlug } = Route.useParams()
  const assessmentData = Route.useLoaderData()

  if (!assessmentData || assessmentData.questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-background-light z-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <p className="text-stone-800 font-black text-xl">
            ¡No hay evaluaciones disponibles!
          </p>
          <p className="text-stone-500 text-sm">
            Este curso aún no cuenta con un examen configurado.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-stone-200 rounded-xl text-stone-700 font-bold text-sm"
          >
            Regresar
          </button>
        </div>
      </div>
    )
  }

  if (!assessmentData) {
    return (
      <div className="fixed inset-0 bg-background-light z-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-stone-500 font-bold">
            Cargando evaluación oficial...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-background-light z-50 flex flex-col font-sans">
      <AssessmentStepper assessment={assessmentData} />
    </div>
  )
}
