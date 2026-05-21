import Stepper from './stepper'
import type { Lesson as LessonType } from './types'

function Lesson(params: LessonType) {
  const { blocks } = params
  return (
    <div className="fixed inset-0 overflow-y-auto bg-background-light z-50 flex flex-col font-sans">
      <Stepper blocks={blocks} />
    </div>
  )
}

export default Lesson
