import { useState } from 'react'
import type { Block as BlockType } from './types'
import { X } from 'lucide-react'
import Content from './content'
import Question from './question'

export default function Stepper({ blocks }: { blocks: BlockType[] }) {
  const [current, setCurrent] = useState(0)
  const block = blocks[current]

  const progress = (current / blocks.length) * 100

  const onLessonComplete = (id: string) => {
    console.log('complete lesson with id: ', id)
  }

  const handleNext = () => {
    if (current < blocks.length) {
      setCurrent((prev) => prev + 1)
    } else {
      onLessonComplete(block.lessonId)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center mx-auto w-full">
      {/* block body */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto w-full">
        <ProgressBar
          progress={progress}
          current={current}
          total={blocks.length}
        />
        {block.type === 'content' ? (
          <div className="max-w-6xl mx-auto px-4 md:px-10 w-full flex flex-col justify-between pb-32">
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
              <Content content={block.content!} />
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-12 py-4 font-black text-lg bg-primary text-white rounded-2xl shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider"
              >
                Entendido
              </button>
            </div>
          </div>
        ) : (
          <Question {...block.question} />
        )}
      </div>
    </div>
  )
}

const ProgressBar = ({
  progress,
  current,
  total,
}: {
  progress: number
  current: number
  total: number
}) => {
  return (
    <header className="max-w-6xl mx-auto px-4 md:px-10 h-16 mb-8 mt-4 border-b border-stone-100 flex items-center justify-between gap-6 w-full">
      <button className="text-stone-400 hover:text-stone-600 transition-colors">
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
    </header>
  )
}
