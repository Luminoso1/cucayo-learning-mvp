import type { Block as BlockType } from './types'
import { useLessonStore } from '#/lib/store/lesson'
import { questionRenderers } from './question.render.tsx'

interface Props {
  block: BlockType
}

export default function Question({ block }: Props) {
  const { id: blockId, question } = block
  const { type } = question

  const savedResponse = useLessonStore((s) => s.responses[blockId])
  const setBlockResponse = useLessonStore((s) => s.setBlockResponse)

  const selectedAnswer =
    savedResponse?.selectedAnswer ??
    (type === 'multiple_cloze' || type === 'ordering' ? null : '')

  const isEvaluated = savedResponse?.isEvaluated ?? false
  const isCorrect = savedResponse?.isCorrect ?? null

  const handleAnswerChange = (newAnswer: any) => {
    setBlockResponse(blockId, {
      selectedAnswer: newAnswer,
      isEvaluated: false,
      isCorrect: null,
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
                disabled={isEvaluated}
                isCorrect={isCorrect}
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
