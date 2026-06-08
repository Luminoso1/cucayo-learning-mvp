import { useRouter, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { completeLessonFn } from '#/lib/lessons/fn'

import type { Lesson as LessonType } from './types'
import { useLessonStore } from '#/lib/store/lesson'
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Award,
  RotateCcw,
} from 'lucide-react'

interface Props {
  lesson: LessonType
}

export default function Summary({ lesson }: Props) {
  const router = useRouter()
  const { courseSlug } = useParams({
    from: '/_authenticated/student/calderos/$courseSlug',
  })

  const { title, content, blocks: initialBlocks } = lesson

  const responses = useLessonStore((s) => s.responses)
  const blocks = useLessonStore((s) => s.blocks)

  const questionBlocks = blocks.filter(
    (b) => b.type === 'question' && b.question,
  )

  let earnedScore = 0
  const maxScore = 100
  const passingScore = 70

  const processedQuestions = questionBlocks.map((block) => {
    const q = block.question!
    const userRes = responses[block.id]
    const isCorrect = userRes?.isCorrect ?? false

    const isSocratic = block.question!.points === 10
    const potentialPoints = block.question?.points ?? 10

    const pointsAwarded = isCorrect ? potentialPoints : 0
    earnedScore += pointsAwarded

    return {
      id: block.id,
      statement: q.statement,
      type: q.type,
      isCorrect,
      isSocratic,
      pointsAwarded,
    }
  })

  const isPassed = earnedScore >= passingScore

  const handleRestartLesson = () => {
    console.log('restart lesson')
    useLessonStore.getState().restart(initialBlocks)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCompleteLesson = async () => {
    setIsSubmitting(true)
    try {
      await completeLessonFn({ data: { lessonId: lesson.id } })

      useLessonStore.getState().reset()

      await router.invalidate()

      router.navigate({
        to: '/student/calderos/$courseSlug',
        params: { courseSlug },
      })
    } catch (error) {
      console.error('Error al completar la lección:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const Table = ({ children }: any) => (
    <div className="w-full overflow-x-auto border border-primary/10 rounded-2xl shadow-sm bg-white mb-8">
      <table className="w-full min-w-max text-left border-collapse">
        {children}
      </table>
    </div>
  )

  const Th = ({ children }: any) => (
    <th className="text-base font-bold p-4 bg-stone-50 text-stone-800 border-b border-stone-100">
      {children}
    </th>
  )

  const Td = ({ children }: any) => (
    <td className="text-base p-4 text-stone-600 border-b border-stone-50 vertical-middle">
      {children}
    </td>
  )

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Encabezado Dinámico de Logro o Reintento */}
      <div className="flex flex-col items-center text-center mb-10">
        {isPassed ? (
          <>
            <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4 animate-bounce duration-1000">
              <Award className="size-12" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-2">
              ¡Lección Aprobada!
            </h2>
          </>
        ) : (
          <>
            <div className="bg-red-100 p-4 rounded-full text-red-500 mb-4 animate-pulse duration-1000">
              <RotateCcw className="size-12" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-2">
              Lección No Superada
            </h2>
          </>
        )}
        <p className="text-stone-500 text-lg md:text-xl font-medium">
          {isPassed ? 'Completaste con éxito:' : 'Te recomendamos repasar:'}{' '}
          <span className="text-stone-800 font-bold">{title}</span>
        </p>
      </div>

      {/* Tarjeta de Score Analítica */}
      <div
        className={`border rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm ${
          isPassed
            ? 'bg-green-50/50 border-green-200'
            : 'bg-red-50/50 border-red-100'
        }`}
      >
        <div>
          <h4 className="text-stone-800 font-black text-lg mb-1">
            Tu puntuación final
          </h4>
          <p className="text-sm text-stone-500">
            {isPassed
              ? `¡Excelente! Has superado el mínimo requerido de ${passingScore} puntos.`
              : `Necesitas un mínimo de ${passingScore} puntos para desbloquear la siguiente unidad.`}
          </p>
        </div>
        <div className="text-center md:text-right">
          <span
            className={`text-4xl md:text-5xl font-black ${isPassed ? 'text-green-600' : 'text-red-500'}`}
          >
            {earnedScore}
          </span>
          <span className="text-stone-400 font-bold text-xl">
            {' '}
            / {maxScore} pts
          </span>
        </div>
      </div>

      {/* Resumen de lo Aprendido */}
      <div className="bg-stone-50 border border-stone-200/60 rounded-3xl p-6 md:p-8 mb-8">
        <h3 className="text-xl md:text-2xl font-black text-stone-900 mb-4">
          📚 Resumen de lo aprendido
        </h3>
        <div className="prose prose-stone max-w-none text-stone-600 text-lg leading-relaxed">
          {content}
        </div>
      </div>

      {/* Tabla Analítica de Preguntas con Puntos */}
      {processedQuestions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl md:text-2xl font-black text-stone-900 mb-4">
            📊 Rendimiento de la evaluación
          </h3>

          <Table>
            <thead>
              <tr>
                <Th>Pregunta / Enunciado</Th>
                <Th>Origen</Th>
                <Th>Resultado</Th>
                <Th>Puntos</Th>
              </tr>
            </thead>
            <tbody>
              {processedQuestions.map((q) => (
                <tr
                  key={q.id}
                  className="hover:bg-stone-50/50 transition-colors"
                >
                  <Td>
                    <span className="font-bold text-stone-800 line-clamp-2">
                      {q.statement}
                    </span>
                  </Td>
                  <Td>
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                        q.isSocratic
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {q.isSocratic ? 'Tutor Socrático' : 'Evaluación base'}
                    </span>
                  </Td>
                  <Td>
                    {q.isCorrect ? (
                      <div className="flex items-center gap-2 text-green-600 font-black">
                        <CheckCircle2 className="size-5 shrink-0" />
                        <span>Correcto</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500 font-black">
                        <XCircle className="size-5 shrink-0" />
                        <span>Incorrecto</span>
                      </div>
                    )}
                  </Td>
                  <Td>
                    <span
                      className={`font-black text-base ${q.pointsAwarded > 0 ? 'text-stone-800' : 'text-stone-400'}`}
                    >
                      +{q.pointsAwarded}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Botón de Acción Condicional */}
      <div className="flex justify-center pt-4">
        {isPassed ? (
          <button
            onClick={handleCompleteLesson}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-12 py-4 font-black text-lg bg-primary text-white rounded-2xl shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none transition-all tracking-wider flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando progreso...
              </>
            ) : (
              <>
                <ArrowLeft className="size-5" />
                Regresar al Curso
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleRestartLesson}
            className="w-full sm:w-auto px-12 py-4 font-black text-lg bg-red-500 text-white rounded-2xl shadow-[0_4px_0_#991b1b] active:translate-y-1 active:shadow-none transition-all tracking-wider flex items-center justify-center gap-2"
          >
            <RotateCcw className="size-5" />
            Repetir la Lección
          </button>
        )}
      </div>
    </div>
  )
}
