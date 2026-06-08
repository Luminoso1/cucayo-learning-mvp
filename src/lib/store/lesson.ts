import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Block } from '#/components/lesson/types'

interface UserResponseState {
  selectedAnswer: any
  isEvaluated: boolean
  isCorrect: boolean | null
}

interface LessonState {
  lessonId: string | null
  index: number
  responses: Record<string, UserResponseState>
  blocks: Block[]

  init: (lessonId: string, initialBlocks: Block[]) => void
  setIndex: (index: number) => void
  setBlocks: (blocks: Block[]) => void
  injectSocraticBlocks: (currentIndex: number, newBlocks: Block[]) => void
  setBlockResponse: (blockId: string, response: UserResponseState) => void
  restart: (initialBlocks: Block[]) => void
  reset: () => void
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      lessonId: null,
      index: 0,
      responses: {},
      blocks: [],

      init: (lessonId, initialBlocks) =>
        set((state) => {
          if (state.lessonId === lessonId && state.blocks.length) {
            return { index: 0 }
          }
          return {
            lessonId,
            index: 0,
            blocks: initialBlocks,
            responses: {},
          }
        }),

      setIndex: (index) => set({ index }),

      setBlocks: (blocks) => set({ blocks }),

      injectSocraticBlocks: (currentIndex, newBlocks) =>
        set((state) => {
          const updatedBlocks = [...state.blocks]
          updatedBlocks.splice(currentIndex + 1, 0, ...newBlocks)
          return { blocks: updatedBlocks }
        }),

      setBlockResponse: (blockId, response) =>
        set((state) => ({
          responses: {
            ...state.responses,
            [blockId]: response,
          },
        })),

      restart: (initialBlocks) =>
        set({ lessonId: null, index: 0, responses: {}, blocks: initialBlocks }),

      reset: () => set({ lessonId: null, index: 0, responses: {} }),
    }),
    {
      name: 'lesson-state',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
