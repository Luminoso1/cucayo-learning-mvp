export interface Lesson {
  duration: number | null
  id: string
  slug: string
  title: string
  order: number
  unitId: string | null
  keyConcepts: string[] | null
  blocks: Block[]
}

export interface Option {
  content: string
  id: string
  order: number | null
  isCorrect: boolean | null
}

export interface Question {
  id: string
  type:
    | 'multiple_choise'
    | 'ordering'
    | 'text_input'
    | 'cloze'
    | 'multiple_cloze'
  statement: string
  metadata: unknown
  points: number | null
  feedbackCorrect: string | null
  feedbackError: string | null
  options: Option[]
}

export interface Block {
  content: string | null
  id: string
  order: number
  lessonId: string
  type: 'content' | 'question'
  questionId: string | null
  question: Question
}
