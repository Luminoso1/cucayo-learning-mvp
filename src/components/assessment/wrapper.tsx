import { useAssessmentStore } from '#/lib/store/assessment'
import { questionRenderers } from '../lesson/question.render.tsx' 

interface Props {
  question: {
    id: string
    type: string
    statement: string
    options: any[]
  }
}

export default function AssessmentQuestionWrapper({ question }: Props) {
  const { id: questionId, type } = question

  const savedResponse = useAssessmentStore((s) => s.responses[questionId])
  const setQuestionResponse = useAssessmentStore((s) => s.setQuestionResponse)

  const selectedAnswer =
    savedResponse?.selectedAnswer ??
    (type === 'multiple_cloze' || type === 'ordering' ? null : '')

  const handleAnswerChange = (newAnswer: any) => {
    setQuestionResponse(questionId, {
      selectedAnswer: newAnswer,
    })
  }

  const QuestionComponent = questionRenderers[type]

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 flex justify-center items-center mb-32 max-w-5xl mx-auto w-full px-4 md:px-8">
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-3 w-full">
            {QuestionComponent ? (
              <QuestionComponent
                question={question}
                value={selectedAnswer}
                onChange={handleAnswerChange}
                disabled={false} // En los exámenes nunca se bloquea la opción al avanzar, se puede re-editar al regresar
                isCorrect={null} // Ocultamos el feedback visual en tiempo real
              />
            ) : (
              <p className="text-red-500">
                Tipo de pregunta no soportado ({type})
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
