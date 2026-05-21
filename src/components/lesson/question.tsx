import type { Question as QuestionType } from './types'

import { CheckCircle2, AlertCircle } from 'lucide-react'

import {
  ClozeQuestion,
  MultiClozeComponent,
  OptionCard,
  OrderingComponent,
} from './utils'

export default function Question(params: QuestionType) {
  const { id, type, statement, options } = params

  const selectedAnswer = null

  const setSelectedAnswer = (_id: string) => {}

  const isEvaluated = false

  const isCorrect = false

  const next = () => {}

  const handleCheck = () => {}

  return (
    <>
      <main className="mb-32 max-w-5xl mx-auto w-full px-4 md:px-8">
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-3 w-full">
            {type === 'cloze' ? (
              <ClozeQuestion
                statement={statement}
                value={selectedAnswer || ''}
                onChange={setSelectedAnswer}
                disabled={isEvaluated}
                isCorrect={isCorrect}
              />
            ) : type === 'multiple_cloze' ? (
              <MultiClozeComponent
                question={params}
                value={selectedAnswer}
                onChange={setSelectedAnswer}
                disabled={isEvaluated}
                isCorrect={isCorrect}
              />
            ) : (
              <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-4">
                {statement}
              </h2>
            )}

            {/* 2. Opciones según el tipo (Selección múltiple, Ordenamiento, Input) */}
            {type === 'multiple_choise' &&
              options.map((opt: any) => (
                <OptionCard
                  key={opt.id}
                  content={opt.content}
                  selected={selectedAnswer === opt.id}
                  disabled={isEvaluated}
                  onClick={() => setSelectedAnswer(opt.id)}
                />
              ))}

            {type === 'ordering' && (
              <OrderingComponent
                key={id}
                options={options}
                onChange={setSelectedAnswer}
                disabled={isEvaluated}
              />
            )}

            {type === 'text_input' && (
              <textarea
                autoFocus
                placeholder="Escribe tu respuesta..."
                value={selectedAnswer || ''}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={isEvaluated}
                className={`w-full p-6 text-xl font-bold rounded-3xl border-2 transition-all outline-none resize-none
            ${
              isEvaluated
                ? isCorrect
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-red-50 border-red-500 text-red-700'
                : 'bg-stone-50 border-stone-200 focus:border-primary focus:bg-white shadow-[0_4px_0_#e7e5e4]'
            }`}
                rows={3}
              />
            )}
          </div>
        </div>
      </main>

      <footer
        className={`w-full py-8 px-6 border-t-2 transition-colors ${isEvaluated ? (isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'border-stone-100'}`}
      >
        <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left mr-auto">
            {isEvaluated && (
              <>
                <div
                  className={`p-3 rounded-2xl ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="size-8" />
                  ) : (
                    <AlertCircle className="size-8" />
                  )}
                </div>
                <div>
                  <h4
                    className={`font-black text-xl ${isCorrect ? 'text-green-800' : 'text-red-800'}`}
                  >
                    {isCorrect ? '¡Excelente!' : 'Buen intento'}
                  </h4>
                  <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                    'Sigue practicando.
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={!isEvaluated ? handleCheck : next}
            disabled={!selectedAnswer && !isEvaluated}
            className={`w-full md:w-auto px-12 py-4 font-black text-lg rounded-2xl transition-all ${
              !isEvaluated
                ? 'bg-primary text-white disabled:bg-stone-200 disabled:shadow-none'
                : isCorrect
                  ? 'bg-green-500 text-white shadow-[0_4px_0_#15803d]'
                  : 'bg-red-500 text-white shadow-[0_4px_0_#b91c1c]'
            } active:translate-y-1 active:shadow-none`}
          >
            {!isEvaluated ? 'Comprobar' : 'Continuar'}
          </button>
        </div>
      </footer>
    </>
  )
}
