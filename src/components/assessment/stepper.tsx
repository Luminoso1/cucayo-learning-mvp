import { useEffect } from 'react'
import { useAssessmentStore } from '#/lib/store/assessment'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import AssessmentQuestionWrapper from './wrapper'
import AssessmentSummary from './summary'
import { cn } from '#/lib/utils'

interface Props {
  assessment: {
    id: string
    title: string
    questions: any[]
  }
}

export default function AssessmentStepper({ assessment }: Props) {
  const { id: assessmentId, questions, title } = assessment

  const current = useAssessmentStore((s) => s.index)
  const setCurrent = useAssessmentStore((s) => s.setIndex)
  const init = useAssessmentStore((s) => s.init)

  useEffect(() => {
    init(assessmentId, questions)
  }, [assessmentId, questions, init])

  const isFinished = current >= questions.length
  const question = !isFinished ? questions[current] : null
  const progress = questions.length > 0 ? (current / questions.length) * 100 : 0

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
    } else {
      setCurrent(questions.length)
    }
  }

  const handlePrevious = () => {
    if (current > 0) setCurrent(current - 1)
  }

  if (isFinished) {
    return (
      <div className="flex-1 w-full overflow-y-auto bg-white min-h-screen">
        <AssessmentSummary assessment={assessment} />
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="flex-1 flex flex-col items-center justify-center mx-auto w-full">
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        {/* Header */}
        <header className="w-full max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center mb-8 mt-4 border-b border-stone-100">
          <div className="flex items-center justify-between gap-6 w-full">
            <button
              className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
              onClick={() => window.history.back()}
            >
              <X className="size-6" />
            </button>
            <div className="flex-1 h-4 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-black text-stone-400">
              {current + 1} / {questions.length}
            </span>
          </div>
        </header>

        {/* Question Area */}
        <AssessmentQuestionWrapper question={question} />
      </div>

      {/* Footer */}
      <Footer
        questionId={question.id}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasPrevious={current > 0}
        hasNext={current < questions.length - 1}
      />
    </div>
  )
}

const Footer = ({
  questionId,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
}: {
  questionId: string
  onNext: () => void
  onPrevious: () => void
  hasPrevious: boolean
  hasNext: boolean
}) => {
  const currentResponse = useAssessmentStore((s) => s.responses[questionId])

  const hasSelectedSomething =
    currentResponse?.selectedAnswer !== undefined &&
    currentResponse?.selectedAnswer !== '' &&
    currentResponse?.selectedAnswer !== null

  return (
    <footer className="w-full border-t border-stone-100 bg-white">
      <div className="max-w-6xl px-4 md:px-8 py-4 lg:py-6 mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={cn(
            'group w-full md:w-auto px-8 py-4 font-black text-base rounded-2xl border-2 transition-all',
            'flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none',
            'disabled:pointer-events-none disabled:border-stone-200 disabled:text-stone-300 disabled:bg-stone-50/50',
            'bg-white border-stone-200 text-secondary-text hover:bg-stone-50 shadow-[0_4px_0_#e7e5e4]',
          )}
        >
          <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
          Regresar
        </button>

        <button
          onClick={onNext}
          disabled={!hasSelectedSomething}
          className={cn(
            'group w-full md:w-auto px-8 py-4 font-black text-base rounded-2xl transition-all',
            'flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none',
            'bg-primary text-white shadow-[0_4px_0_#9a7309] disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none',
          )}
        >
          <span>{hasNext ? 'Continuar' : 'Finalizar Examen'}</span>
          <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </footer>
  )
}
