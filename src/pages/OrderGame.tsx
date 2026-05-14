import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { movements } from '../data/movements'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  // ensure result is not already sorted
  const sorted = movements.map((m) => m.id)
  if (a.every((v, i) => v === sorted[i])) return shuffle(arr)
  return a
}

interface CardProps {
  id: number
  name: string
  icon: string
  position: number
  checked: boolean
  isCorrect: boolean
  isDragActive: boolean
}

function SortableCard({ id, name, icon, position, checked, isCorrect, isDragActive }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: checked,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-label={name}
      className={[
        'flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm',
        'select-none outline-none',
        !checked ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
        isDragging
          ? 'opacity-40'
          : isDragActive
          ? 'border-primary-200'
          : 'border-gray-200',
        checked && isCorrect ? 'border-green-400 bg-green-50' : '',
        checked && !isCorrect ? 'border-red-300 bg-red-50' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
        {position + 1}
      </span>
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <span className="flex-1 font-medium text-gray-900 text-sm leading-tight">{name}</span>
      {checked ? (
        <span className={`text-base font-bold flex-shrink-0 ${isCorrect ? 'text-green-500' : 'text-red-400'}`}>
          {isCorrect ? '✓' : '✗'}
        </span>
      ) : (
        <svg
          className="w-5 h-5 text-gray-300 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="7" cy="5" r="1.5" />
          <circle cx="7" cy="10" r="1.5" />
          <circle cx="7" cy="15" r="1.5" />
          <circle cx="13" cy="5" r="1.5" />
          <circle cx="13" cy="10" r="1.5" />
          <circle cx="13" cy="15" r="1.5" />
        </svg>
      )}
    </div>
  )
}

const correctOrder = movements.map((m) => m.id)

export function OrderGame() {
  const [items, setItems] = useState<number[]>(() => shuffle(correctOrder))
  const [checked, setChecked] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragStart(_event: DragStartEvent) {
    setIsDragActive(true)
  }

  function handleDragEnd(event: DragEndEvent) {
    setIsDragActive(false)
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const from = prev.indexOf(active.id as number)
        const to = prev.indexOf(over.id as number)
        return arrayMove(prev, from, to)
      })
    }
  }

  const correctCount = items.filter((id, i) => id === correctOrder[i]).length
  const allCorrect = correctCount === correctOrder.length

  function handleRestart() {
    setItems(shuffle(correctOrder))
    setChecked(false)
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-primary-600 hover:underline">
          ← Басты бет
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mt-2">
          Ойын — Қимылдар реті
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Намаздың 8 қимылын дұрыс ретке келтір. Карточкаларды сүйреп орналастыр.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {items.map((id, index) => {
              const movement = movements.find((m) => m.id === id)!
              return (
                <SortableCard
                  key={id}
                  id={id}
                  name={movement.name}
                  icon={movement.icon}
                  position={index}
                  checked={checked}
                  isCorrect={id === correctOrder[index]}
                  isDragActive={isDragActive}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-6">
        {!checked ? (
          <button onClick={() => setChecked(true)} className="btn-primary w-full">
            Тексеру
          </button>
        ) : (
          <div className="card text-center py-6">
            <p className="text-4xl mb-3">
              {allCorrect ? '🎉' : correctCount >= 6 ? '👍' : '💪'}
            </p>
            <p className="text-xl font-bold text-gray-900 mb-1">
              {correctCount} / {correctOrder.length} дұрыс
            </p>
            <p className="text-gray-600 text-sm mb-5">
              {allCorrect
                ? 'МашаАллаh! Барлық қимылды дұрыс реттедің!'
                : correctCount >= 6
                ? 'Жақсы нәтиже! Қайта байқап 100% жеткіз.'
                : 'Қайталап байқа — намаз қимылдарын оқып шық.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleRestart} className="btn-primary">
                Қайтадан ойнау
              </button>
              <Link to="/movements" className="btn-secondary">
                Қимылдарды оқу →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
