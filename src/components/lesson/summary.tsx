import type { Block as BlockType } from './types'
import { useLessonStore } from '#/lib/store/lesson'
import { CheckCircle2, XCircle, ArrowLeft, Award } from 'lucide-react'

interface SummaryProps {
  lessonTitle: string
  lessonContent: string
  blocks: BlockType[]
}

export default function Summary({
  lessonTitle,
  lessonContent,
  blocks,
}: SummaryProps) {
  const responses = useLessonStore((s) => s.responses)

  const questionBlocks = blocks.filter(
    (b) => b.type === 'question' && b.question,
  )

  const totalQuestions = questionBlocks.length
  const correctAnswers = questionBlocks.filter(
    (b) => responses[b.id]?.isCorrect,
  ).length

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
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Encabezado de Logro */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4 animate-bounce duration-1000">
          <Award className="size-12" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-2">
          ¡Lección Completada!
        </h2>
        <p className="text-stone-500 text-lg md:text-xl font-medium">
          Has completado con éxito:{' '}
          <span className="text-stone-800 font-bold">{lessonTitle}</span>
        </p>
      </div>

      {/* Bloque 1: Resumen General de lo Aprendido (lessons.content) */}
      <div className="bg-stone-50 border border-stone-200/60 rounded-3xl p-6 md:p-8 mb-8">
        <h3 className="text-xl md:text-2xl font-black text-stone-900 mb-4">
          📚 Resumen de lo aprendido
        </h3>
        <div className="prose prose-stone max-w-none text-stone-600 text-lg leading-relaxed">
          {lessonContent}
        </div>
      </div>

      {/* Bloque 2: Tabla Analítica de Preguntas */}
      {totalQuestions > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl md:text-2xl font-black text-stone-900">
              📊 Rendimiento de la evaluación
            </h3>
            <span className="text-sm md:text-base font-black px-4 py-1.5 bg-primary/10 text-primary rounded-full">
              {correctAnswers} / {totalQuestions} Correctas
            </span>
          </div>

          <Table>
            <thead>
              <tr>
                <Th>Pregunta / Enunciado</Th>
                <Th>Tipo</Th>
                <Th>Resultado</Th>
              </tr>
            </thead>
            <tbody>
              {questionBlocks.map((block) => {
                const q = block.question!
                const isCorrect = responses[block.id]?.isCorrect ?? false

                return (
                  <tr
                    key={block.id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    <Td>
                      <span className="font-bold text-stone-800 line-clamp-2">
                        {q.statement}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-stone-100 text-stone-500 rounded-lg">
                        {q.type.replace('_', ' ')}
                      </span>
                    </Td>
                    <Td>
                      {isCorrect ? (
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
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}

      {/* Botón de Salida */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto px-12 py-4 font-black text-lg bg-primary text-white rounded-2xl shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none transition-all tracking-wider flex items-center justify-center gap-2"
        >
          <ArrowLeft className="size-5" />
          Regresar al Curso
        </button>
      </div>
    </div>
  )
}
