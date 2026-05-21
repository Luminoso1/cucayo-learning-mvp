import { useState } from 'react'
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

export function MultiClozeComponent({
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

export function ClozeSlot({
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

export function ClozeQuestion({
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

export function OrderingComponent({ options, onChange, disabled }: any) {
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

export function OptionCard({ content, selected, onClick, disabled }: any) {
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
