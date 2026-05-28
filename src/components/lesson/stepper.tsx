import { useState, useEffect } from 'react'
import type { Block as BlockType } from './types'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Content from './content'
import Question from './question'
import Summary from './summary'
import { useLessonStore } from '#/lib/store/lesson'
import { questionValidators } from './question.validators'

import { cn } from '#/lib/utils/index.ts'

interface Props {
  lessonId: string
  lessonTitle: string
  lessonContent: string
  blocks: BlockType[]
}

export default function Stepper({
  lessonId,
  lessonTitle,
  lessonContent,
  blocks: initialBlocks,
}: Props) {
  const [blocks, setBlocks] = useState<BlockType[]>(initialBlocks)

  const current = useLessonStore((s) => s.index)
  const setCurrent = useLessonStore((s) => s.setIndex)
  const init = useLessonStore((s) => s.init)

  const isFinished = current >= blocks.length

  const block = !isFinished ? blocks[current] : null
  const progress = blocks.length > 0 ? (current / blocks.length) * 100 : 0

  useEffect(() => {
    init(lessonId)
  }, [lessonId, init])

  const onLessonComplete = () => {
    console.log('complete lesson with id: ')

    //do complete lesson action

    // window.history.back()
  }

  const handleNext = () => {
    if (current < blocks.length - 1) {
      setCurrent(current + 1)
    } else {
      setCurrent(blocks.length)
      onLessonComplete()
    }
  }

  const handlePrevious = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const handleInjectSocraticBlock = (block: BlockType) => {
    setBlocks((prev) => {
      const newBlocks = [...prev]
      newBlocks.splice(current + 1, 0, block)
      return newBlocks
    })
  }

  if (isFinished) {
    return (
      <div className="flex-1 w-full overflow-y-auto bg-white min-h-screen">
        <Summary
          lessonTitle={lessonTitle}
          lessonContent={lessonContent}
          blocks={blocks}
        />
      </div>
    )
  }

  if (!block) return null

  return (
    <div className="flex-1 flex flex-col items-center justify-center mx-auto w-full">
      {/* block body */}
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        <Header progress={progress} current={current} total={blocks.length} />
        {block.type === 'content' ? (
          <div className="flex-1 flex">
            <div className="flex flex-col justify-between w-full max-w-6xl mx-auto">
              <div className="mx-auto px-4 md:px-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <Content content={block.content!} />
              </div>
            </div>
          </div>
        ) : (
          <Question block={block} />
        )}
      </div>

      <Footer
        block={block}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasPrevious={current > 0}
        hasNext={current < blocks.length}
      />
    </div>
  )
}

const Header = (props: {
  progress: number
  current: number
  total: number
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center mb-8 mt-4 border-b border-stone-100">
      <Progress {...props} />
    </header>
  )
}

const Progress = ({
  progress,
  current,
  total,
}: {
  progress: number
  current: number
  total: number
}) => {
  return (
    <div className="flex items-center justify-between gap-6 w-full">
      <button
        className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
        onClick={() => window.history.back()}
      >
        <X className="size-6" />
      </button>

      <div className="flex-1 h-4 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-sm font-black text-stone-400">
        {current + 1} / {total}
      </span>
    </div>
  )
}

const Footer = ({
  block,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
}: {
  block: BlockType
  onNext: () => void
  onPrevious: () => void
  hasPrevious: boolean
  hasNext: boolean
}) => {
  const setBlockResponse = useLessonStore((s) => s.setBlockResponse)
  const currentResponse = useLessonStore((s) => s.responses[block.id])

  const isContent = block.type === 'content'

  const isEvaluated = isContent ? true : (currentResponse?.isEvaluated ?? false)
  const isCorrect = isContent ? true : (currentResponse?.isCorrect ?? false)

  const hasSelectedSomething = isContent
    ? true
    : currentResponse?.selectedAnswer !== undefined &&
      currentResponse?.selectedAnswer !== '' &&
      currentResponse?.selectedAnswer !== null

  const handleAction = () => {
    if (isContent || isEvaluated) {
      onNext()
      return
    }

    if (block.question) {
      const validator = questionValidators[block.question.type]
      const answer = currentResponse?.selectedAnswer
      const correct = validator ? validator(answer, block.question) : false

      setBlockResponse(block.id, {
        selectedAnswer: answer,
        isEvaluated: true,
        isCorrect: correct,
      })
    }
  }

  const showFeedback = isEvaluated && !isContent

  return (
    <footer
      className={cn(
        'w-full border-transparent transition-colors duration-300',
        showFeedback &&
          (isCorrect
            ? 'border-t bg-green-50/80 border-green-200'
            : 'border-t bg-red-50/80 border-red-200'),
      )}
    >
      <div className="max-w-6xl px-4 md:px-8 py-4 lg:py-6 mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={cn(
            'group w-full md:w-auto px-8 py-4 font-black text-base rounded-2xl border-2 transition-all',
            'flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none',
            'disabled:pointer-events-none disabled:border-stone-200 disabled:text-stone-300 disabled:bg-stone-50/50',
            showFeedback
              ? isCorrect
                ? 'bg-transparent border-green-300 text-green-700 hover:bg-green-100/50 shadow-[0_4px_0_var(--color-green-300)]'
                : 'bg-transparent border-red-300 text-red-700 hover:bg-red-100/50 shadow-[0_4px_0_var(--color-red-300)]'
              : 'bg-white border-stone-200 text-secondary-text hover:bg-stone-50 shadow-[0_4px_0_#e7e5e4]',
          )}
        >
          <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
          Regresar
        </button>

        {/* Next | Tutor Action */}
        <button
          onClick={handleAction}
          disabled={!hasSelectedSomething}
          className={cn(
            // Clases base y tipografía
            'group w-full md:w-auto px-8 py-4 font-black text-base rounded-2xl transition-all',
            'flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none',
            // Lógica de colores según evaluación
            !isEvaluated
              ? 'bg-primary text-white shadow-[0_4px_0_#9a7309] disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none'
              : isCorrect
                ? 'bg-green-500 text-white shadow-[0_4px_0_#15803d]'
                : 'bg-red-500 text-white shadow-[0_4px_0_#b91c1c]',
          )}
        >
          <span>
            {isContent
              ? hasNext
                ? 'Continuar'
                : 'Terminar'
              : !isEvaluated
                ? 'Comprobar'
                : hasNext
                  ? 'Continuar'
                  : 'Terminar'}
          </span>
          <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </footer>
  )
}
