import { create } from 'zustand'

export interface AssessmentResponse {
  selectedAnswer: any
}

interface AssessmentState {
  questions: any[]
  index: number
  responses: Record<string, AssessmentResponse>
  assessmentId: string | null
  init: (assessmentId: string, questions: any[]) => void
  setIndex: (index: number) => void
  setQuestionResponse: (
    questionId: string,
    response: AssessmentResponse,
  ) => void
  reset: () => void
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  questions: [],
  index: 0,
  responses: {},
  assessmentId: null,
  init: (assessmentId, questions) =>
    set({ assessmentId, questions, index: 0, responses: {} }),
  setIndex: (index) => set({ index }),
  setQuestionResponse: (questionId, response) =>
    set((state) => ({
      responses: { ...state.responses, [questionId]: response },
    })),
  reset: () =>
    set({ questions: [], index: 0, responses: {}, assessmentId: null }),
}))
