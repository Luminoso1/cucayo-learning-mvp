import Stepper from './block'
import type { Lesson as LessonType } from './types'

function Lesson(params: LessonType) {
  const { blocks } = params
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col font-sans">
      <Stepper blocks={blocks} />
    </div>
  )
}

export default Lesson
