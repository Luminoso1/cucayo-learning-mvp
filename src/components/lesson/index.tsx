import Stepper from './stepper'
import type { Lesson as LessonType } from './types'

interface Props {
  lesson: LessonType
}

function Lesson({ lesson }: Props) {
  if (lesson.blocks.length === 0) {
    return (
      <div className="fixed inset-0 bg-background-light z-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-stone-500 font-bold">
            Cargando los bloques de la lección...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-background-light z-50 flex flex-col font-sans">
      <Stepper lesson={lesson} />
    </div>
  )
}

export default Lesson
