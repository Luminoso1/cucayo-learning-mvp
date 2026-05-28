import type { Question as QuestionType } from './types'

export type ValidationStrategy = (
  selectedAnswer: string | null,
  question: QuestionType,
) => boolean

export const questionValidators: Record<string, ValidationStrategy> = {
  multiple_choise: (answer, question) => {
    const correctOption = question.options.find((opt) => opt.isCorrect)
    return answer === correctOption?.id
  },
  ordering: (answer, question) => {
    const correctOrder = [...question.options]
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((o) => o.id)
    return JSON.stringify(answer) === JSON.stringify(correctOrder)
  },
  text_input: (answer, question) => {
    const userInput = (answer || '').trim().toLowerCase()
    return question.options.some(
      (opt) => opt.isCorrect && opt.content.trim().toLowerCase() === userInput,
    )
  },
  cloze: (answer, question) => {
    const userInput = (answer || '').trim().toLowerCase()
    const solution = question.options
      .find((opt) => opt.isCorrect)
      ?.content.trim()
      .toLowerCase()
    return userInput === solution
  },
  multiple_cloze: (answer, question) => {
    const correctOptions = question.options.filter((opt) => opt.isCorrect)
    return correctOptions.every((opt: any) => {
      const userValue = (answer?.[opt.order] || '').trim().toLowerCase()
      return userValue === opt.content.trim().toLowerCase()
    })
  },
}
