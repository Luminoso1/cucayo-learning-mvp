import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserResponseState {
  selectedAnswer: any
  isEvaluated: boolean
  isCorrect: boolean | null
}

interface LessonState {
  lessonId: string | null
  index: number
  responses: Record<string, UserResponseState>

  init: (lessonId: string) => void
  setIndex: (index: number) => void
  setBlockResponse: (blockId: string, response: UserResponseState) => void
  reset: () => void
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      lessonId: null,
      index: 0,
      responses: {},

      init: (lessonId) =>
        set((state) => {
          if (state.lessonId === lessonId) return { ...state, index: 0 }
          return {
            lessonId,
            index: 0,
            responses: {},
          }
        }),

      setIndex: (index) => set({ index }),

      setBlockResponse: (blockId, response) =>
        set((state) => ({
          responses: {
            ...state.responses,
            [blockId]: response,
          },
        })),

      reset: () => set({ lessonId: null, index: 0, responses: {} }),
    }),
    {
      name: 'lesson-state',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
