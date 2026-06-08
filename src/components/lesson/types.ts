export interface Block {
  id: string
  lessonId: string
  type: 'content' | 'question'
  order: number

  content: string | null

  questionId: string | null
  question: Question | null
}

export interface Lesson {
  id: string
  slug: string
  unitId: string | null
  title: string
  content: string
  duration: number | null
  order: number

  blocks: Block[]

  keyConcepts: string[] | null
}

export interface Option {
  id: string
  content: string
  isCorrect: boolean | null
  order: number | null
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
