import { useAssessmentStore } from '#/lib/store/assessment'
import { questionValidators } from '../lesson/question.validators'
import { CheckCircle, XCircle, Award } from 'lucide-react'

interface Props {
  assessment: {
    id: string
    title: string
    questions: any[]
  }
}

export default function AssessmentSummary({ assessment }: Props) {
  const responses = useAssessmentStore((s) => s.responses)
  const reset = useAssessmentStore((s) => s.reset)

  // Calcular métricas
  let correctAnswers = 0
  let totalPointsEarned = 0
  let maxPoints = 0

  const results = assessment.questions.map((q) => {
    const userAns = responses[q.id]?.selectedAnswer
    const validator = questionValidators[q.type]
    const isCorrect = validator ? validator(userAns, q) : false

    maxPoints += q.points || 10
    if (isCorrect) {
      correctAnswers++
      totalPointsEarned += q.points || 10
    }

    return { ...q, isCorrect, userAns }
  })

  const scorePercentage = Math.round((totalPointsEarned / maxPoints) * 100)
  const passed = scorePercentage >= 70 // Umbral de tu schema (passingScore: 70)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center font-sans space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="inline-flex p-4 rounded-full bg-stone-50 text-primary mb-2">
          <Award className="size-16" />
        </div>
        <h1 className="text-3xl font-black text-stone-900">
          {assessment.title}
        </h1>
        <p className="text-stone-500 text-lg">
          Resultados de tu evaluación oficial
        </p>
      </div>

      {/* Tarjeta de Score */}
      <div className="bg-stone-50 border-2 border-stone-100 rounded-3xl p-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="text-center border-r border-stone-200">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Puntaje
          </p>
          <p className="text-4xl font-black text-stone-800 mt-1">
            {scorePercentage}%
          </p>
        </div>
        <div className="text-center flex flex-col justify-center items-center">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Estado
          </p>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-xl text-sm font-black ${
              passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {passed ? 'APROBADO' : 'REPROBADO'}
          </span>
        </div>
      </div>

      {/* Lista detallada de aciertos */}
      <div className="text-left space-y-4 max-w-xl mx-auto">
        <h3 className="font-black text-stone-800 text-lg">
          Revisión de respuestas:
        </h3>
        {results.map((r, i) => (
          <div
            key={r.id}
            className="flex items-start gap-3 p-4 bg-white border-2 border-stone-100 rounded-2xl"
          >
            {r.isCorrect ? (
              <CheckCircle className="size-6 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="size-6 text-red-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-stone-800 text-sm">
                Pregunta {i + 1}
              </p>
              <p className="text-stone-600 text-sm mt-0.5">{r.statement}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          reset()
          window.history.back()
        }}
        className="px-8 py-4 bg-primary text-white font-black text-base rounded-2xl shadow-[0_4px_0_#9a7309] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all"
      >
        Volver al Panel del Curso
      </button>
    </div>
  )
}
