import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { X, CheckCircle2, AlertCircle, Trophy } from 'lucide-react'
import { getAssessmentByLessonSlugFn } from '#/features/assessment/fn'
import {
  DragOverlay,
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const Route = createFileRoute(
  '/_authenticated/student/calderos/$courseSlug/lesson/$lessonSlug/assessment',
)({
  loader: async ({ params }) =>
    getAssessmentByLessonSlugFn({ data: params.lessonSlug }),
  component: RouteComponent,
})

function RouteComponent() {
  const assessment = Route.useLoaderData()
  const { courseSlug, lessonSlug } = Route.useParams()

  const [isFinished, setIsFinished] = useState(false)
  const [finalStats, setFinalStats] = useState({ score: 0, correctCount: 0 })

  const handleFinish = (score: number, correctCount: number) => {
    setFinalStats({ score, correctCount })
    setIsFinished(true)
  }

  if (isFinished) {
    return (
      <ResultsView
        score={finalStats.score}
        total={assessment.points}
        correctAnswers={finalStats.correctCount}
        totalQuestions={assessment.assessmentQuestions.length}
        courseSlug={courseSlug}
        lessonSlug={lessonSlug}
      />
    )
  }

  return <AssessmentStepper assessment={assessment} onFinish={handleFinish} />
}

// --- Stepper ---
function AssessmentStepper({
  assessment,
  onFinish,
}: {
  assessment: any
  onFinish: (s: number, c: number) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null)
  const [isEvaluated, setIsEvaluated] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const currentQuestion = assessment.assessmentQuestions[currentIndex]?.question
  const progress = (currentIndex / assessment.assessmentQuestions.length) * 100
  const type = currentQuestion.type

  const handleCheck = () => {
    if (!currentQuestion) return

    let correct = false

    if (type === 'multiple_choise') {
      const correctOption = currentQuestion.options.find(
        (o: any) => o.isCorrect,
      )
      correct = selectedAnswer === correctOption?.id
    } else if (type === 'ordering') {
      const correctOrder = [...currentQuestion.options]
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((o) => o.id)
      correct = JSON.stringify(selectedAnswer) === JSON.stringify(correctOrder)
    } else if (type === 'short_answer') {
      const userAnswer = (selectedAnswer || '').trim().toLowerCase()
      correct = currentQuestion.options.some(
        (o: any) =>
          o.isCorrect && o.content.trim().toLowerCase() === userAnswer,
      )
    } else if (type === 'text_input') {
      const userInput = (selectedAnswer || '').trim().toLowerCase()
      correct = currentQuestion.options.some(
        (o: any) => o.isCorrect && o.content.trim().toLowerCase() === userInput,
      )
    } else if (type === 'cloze') {
      const userInput = (selectedAnswer || '').trim().toLowerCase()
      // En cloze, solemos comparar contra la primera opción correcta
      const solution = currentQuestion.options
        .find((o: any) => o.isCorrect)
        ?.content.trim()
        .toLowerCase()
      correct = userInput === solution
    } else if (type === 'multiple_cloze') {
      const correctOptions = currentQuestion.options.filter(
        (o: any) => o.isCorrect,
      )

      // Validamos que CADA hueco {{n}} coincida con la opción que tiene order === n
      correct = correctOptions.every((opt: any) => {
        const userValue = (selectedAnswer?.[opt.order] || '')
          .trim()
          .toLowerCase()
        return userValue === opt.content.trim().toLowerCase()
      })
    }

    setIsCorrect(correct)
    setIsEvaluated(true)
    if (correct) {
      setScore((s) => s + (currentQuestion.points || 10))
      setCorrectCount((c) => c + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < assessment.assessmentQuestions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setIsEvaluated(false)
      setIsCorrect(null)
    } else {
      onFinish(score, correctCount)
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col font-sans">
      <header className="max-w-5xl mx-auto w-full px-6 py-8 flex items-center gap-6">
        <button
          onClick={() => window.history.back()}
          className="text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X className="size-8" />
        </button>
        <div className="flex-1 h-4 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-3 w-full">
            {type === 'cloze' ? (
              <ClozeQuestion
                statement={currentQuestion.statement}
                value={selectedAnswer || ''}
                onChange={setSelectedAnswer}
                disabled={isEvaluated}
                isCorrect={isCorrect}
              />
            ) : type === 'multiple_cloze' ? (
              <MultiClozeComponent
                question={currentQuestion}
                value={selectedAnswer}
                onChange={setSelectedAnswer}
                disabled={isEvaluated}
                isCorrect={isCorrect}
              />
            ) : (
              <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-4">
                {currentQuestion?.statement}
              </h2>
            )}

            {/* 2. Opciones según el tipo (Selección múltiple, Ordenamiento, Input) */}
            {type === 'multiple_choise' &&
              currentQuestion.options.map((opt: any) => (
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
                key={currentQuestion.id}
                options={currentQuestion.options}
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
        className={`py-8 px-6 border-t-2 transition-colors ${isEvaluated ? (isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'bg-white border-stone-100'}`}
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
                    {isCorrect
                      ? currentQuestion?.feedbackCorrect
                      : currentQuestion?.feedbackError || 'Sigue practicando.'}
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={!isEvaluated ? handleCheck : handleNext}
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
    </div>
  )
}

function MultiClozeComponent({
  question,
  value,
  onChange,
  disabled,
  isEvaluated,
  isCorrect,
}: any) {
  const parts = question.statement.split(/(\{\{\d+?\}\})/)
  const userResponses = value || {}
  const [activeId, setActiveId] = useState<string | null>(null)

  // Mantener las opciones mezcladas
  const [shuffledOptions] = useState(() =>
    [...question.options].sort(() => Math.random() - 0.5),
  )

  const handleDragStart = (event: any) => {
    if (disabled) return
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    setActiveId(null)
    const { active, over } = event

    if (!over) return

    const content = active.data.current.content
    const slotIdx = over.id.toString()

    // Si soltamos sobre un hueco (ej: "slot-0")
    if (slotIdx.startsWith('slot-')) {
      const index = slotIdx.replace('slot-', '')

      // Si la palabra ya estaba en otro hueco, la movemos
      const existingSlot = Object.entries(userResponses).find(
        ([_, val]) => val === content,
      )
      const newResponses = { ...userResponses }

      if (existingSlot) delete newResponses[existingSlot[0]]

      newResponses[index] = content
      onChange(newResponses)
    }
  }

  // Función para devolver al banco (haciendo clic)
  const removeItem = (slotIdx: string) => {
    if (disabled) return
    const newResponses = { ...userResponses }
    delete newResponses[slotIdx]
    onChange(newResponses)
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full space-y-10">
        {/* Oración con Huecos Droppable */}
        <div className="text-2xl md:text-3xl font-bold text-stone-800 leading-14">
          {parts.map((part: string, i: number) => {
            const match = part.match(/\{\{(\d+)\}\}/)
            if (match) {
              const slotIdx = match[1]
              return (
                <ClozeSlot
                  key={i}
                  id={`slot-${slotIdx}`}
                  content={userResponses[slotIdx]}
                  isEvaluated={isEvaluated}
                  isCorrect={isCorrect}
                  onRemove={() => removeItem(slotIdx)}
                  disabled={disabled}
                />
              )
            }
            return <span key={i}>{part}</span>
          })}
        </div>

        {/* Banco de Palabras Draggable */}
        <div className="flex flex-wrap gap-3 justify-center p-8 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
          {shuffledOptions.map((opt: any) => {
            const isUsed = Object.values(userResponses).includes(opt.content)
            return (
              <DraggableOption
                key={opt.id}
                id={opt.id}
                content={opt.content}
                isUsed={isUsed}
                disabled={disabled}
              />
            )
          })}
        </div>
      </div>

      {/* Lo que se ve mientras arrastras */}
      <DragOverlay>
        {activeId ? (
          <div className="px-5 py-3 rounded-2xl border-2 border-primary bg-white text-primary font-black shadow-xl cursor-grabbing scale-105">
            {shuffledOptions.find((o) => o.id === activeId)?.content}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function ClozeSlot({
  id,
  content,
  isEvaluated,
  isCorrect,
  onRemove,
  disabled,
}: any) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <span
      ref={setNodeRef}
      onClick={content ? onRemove : undefined}
      className={`inline-flex items-center justify-center min-w-37.5 h-14 mx-2 px-4 border-b-4 rounded-2xl transition-all align-middle cursor-pointer
        ${!content ? (isOver ? 'border-primary bg-primary/10 scale-105' : 'border-dashed border-stone-300 bg-stone-100/50') : 'border-primary bg-primary/5 text-primary'}
        ${isEvaluated ? (isCorrect ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700') : ''}
        ${disabled && content ? 'cursor-default' : 'hover:bg-stone-50'}
      `}
    >
      {content || ''}
    </span>
  )
}

function DraggableOption({ id, content, isUsed, disabled }: any) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
    data: { content },
  })

  if (isUsed) {
    return (
      <div className="px-5 py-3 rounded-2xl border-2 border-stone-100 bg-stone-100 text-transparent font-bold select-none">
        {content}
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`px-5 py-3 rounded-2xl border-2 border-stone-200 bg-white text-stone-700 font-bold shadow-[0_4px_0_#e7e5e4] transition-all cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-0' : 'hover:border-primary hover:text-primary'}
      `}
    >
      {content}
    </div>
  )
}

function ClozeQuestion({
  statement,
  value,
  onChange,
  disabled,
  isCorrect,
}: any) {
  const parts = statement.split(/(\{\{.*?\}\})/)

  return (
    <div className="text-2xl md:text-3xl font-bold text-stone-800 leading-relaxed inline-block">
      {parts.map((part: string, i: number) => {
        if (part.startsWith('{{') && part.endsWith('}}')) {
          return (
            <input
              key={i}
              autoFocus
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder="..."
              className={`mx-2 px-4 py-1 border-b-4 outline-none transition-all text-center rounded-lg
                ${
                  disabled
                    ? isCorrect
                      ? 'border-green-500 text-green-600'
                      : 'border-red-500 text-red-600'
                    : 'border-stone-300 focus:border-primary bg-stone-50'
                }`}
              style={{ width: `${Math.max(part.length - 4, 4)}ch` }}
            />
          )
        }
        return <span key={i}>{part}</span>
      })}
    </div>
  )
}

function OrderingComponent({ options, onChange, disabled }: any) {
  const [items, setItems] = useState(options)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: any) {
    if (disabled) return
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i: any) => i.id === active.id)
      const newIndex = items.findIndex((i: any) => i.id === over.id)
      const newOrder = arrayMove(items, oldIndex, newIndex)
      setItems(newOrder)
      onChange(newOrder.map((i: any) => i.id))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="grid gap-2 w-full">
          {items.map((item: any) => (
            <SortableItem
              key={item.id}
              id={item.id}
              content={item.content}
              disabled={disabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableItem({ id, content, disabled }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 bg-white border-2 border-stone-200 rounded-2xl font-bold text-stone-600 shadow-[0_4px_0_#e7e5e4] ${isDragging ? 'opacity-50 border-primary' : ''} ${disabled ? 'cursor-default' : 'cursor-grab'}`}
    >
      {content}
    </div>
  )
}

function OptionCard({ content, selected, onClick, disabled }: any) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all ${
        selected
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
      } active:translate-y-1 active:shadow-none disabled:opacity-100`}
    >
      {content}
    </button>
  )
}

function ResultsView({
  score,
  correctAnswers,
  totalQuestions,
  courseSlug,
  lessonSlug,
}: any) {
  const navigate = useNavigate()
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)
  const isPassed = percentage >= 70

  return (
    <div className="fixed inset-0 bg-white z-60 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div
          className={`size-32 rounded-full flex items-center justify-center mx-auto ${isPassed ? 'bg-yellow-100 text-yellow-600' : 'bg-stone-100 text-stone-400'}`}
        >
          <Trophy className="size-16" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-stone-900">
            {isPassed ? '¡Lección Completada!' : 'Sigue practicando'}
          </h1>
          <p className="text-stone-500 text-lg font-medium">
            {isPassed
              ? 'Has ganado mucha XP hoy.'
              : 'Vuelve a intentarlo para mejorar tu nota.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-stone-50 p-6 rounded-2xl border-2 border-stone-100 leading-tight">
            <span className="text-stone-400 text-xs font-bold uppercase">
              Precisión
            </span>
            <p className="text-3xl font-black">{percentage}%</p>
          </div>
          <div className="bg-stone-50 p-6 rounded-2xl border-2 border-stone-100 leading-tight">
            <span className="text-stone-400 text-xs font-bold uppercase">
              Puntos
            </span>
            <p className="text-3xl font-black text-primary">+{score}</p>
          </div>
        </div>

        <div className="flex max-w-5xl w-full gap-10">
          <button
            onClick={() =>
              navigate({
                to: '/student/calderos/$courseSlug/lesson/$lessonSlug',
                params: { courseSlug, lessonSlug },
              })
            }
            className="w-full py-6 px-4 border-b-4 border-primary text-primary text-xl font-bold rounded-2xl active:translate-y-1 active:shadow-none transition-all"
          >
            Continuar Lección
          </button>

          {score >= 70 && (
            <button
              onClick={() =>
                navigate({
                  to: '/student/calderos/$courseSlug',
                  params: { courseSlug },
                })
              }
              className="w-full py-6 px-4 bg-primary text-white text-xl font-black rounded-2xl active:translate-y-1 active:shadow-none transition-all"
            >
              Finalizar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
