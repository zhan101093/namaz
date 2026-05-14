import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Pair {
  id: number
  left: string
  right: string
  icon: string
}

const pairs: Pair[] = [
  { id: 1, left: 'Тәкбір', right: 'Аллаhу Акбар', icon: '🙌' },
  { id: 2, left: 'Руку', right: 'Субхана Раббиял-Азым', icon: '🫄' },
  { id: 3, left: 'Рукудан тұру', right: 'Самиаллаhу лиман хамидаh', icon: '🧍' },
  { id: 4, left: 'Сәжде', right: 'Субхана Раббиял-Аъля', icon: '🙇' },
  { id: 5, left: 'Екі сәжде арасы', right: 'Раббиғфир ли', icon: '🧘' },
  { id: 6, left: 'Салам', right: 'Ас-саламу алейкум', icon: '🤲' },
]

const COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#ec4899']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface LineData {
  leftId: number
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
}

export function MatchGame() {
  const [shuffledRight, setShuffledRight] = useState<number[]>(() => shuffle(pairs.map((p) => p.id)))
  const [connections, setConnections] = useState<Map<number, number>>(new Map())
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [lines, setLines] = useState<LineData[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const leftRefs = useRef<Record<number, HTMLButtonElement | null>>({})
  const rightRefs = useRef<Record<number, HTMLButtonElement | null>>({})

  const calcLines = () => {
    const cr = containerRef.current?.getBoundingClientRect()
    if (!cr) return
    const result: LineData[] = []
    connections.forEach((rightId, leftId) => {
      const lEl = leftRefs.current[leftId]
      const rEl = rightRefs.current[rightId]
      if (!lEl || !rEl) return
      const lr = lEl.getBoundingClientRect()
      const rr = rEl.getBoundingClientRect()
      result.push({
        leftId,
        x1: lr.right - cr.left,
        y1: lr.top + lr.height / 2 - cr.top,
        x2: rr.left - cr.left,
        y2: rr.top + rr.height / 2 - cr.top,
        color: COLORS[(leftId - 1) % COLORS.length],
      })
    })
    setLines(result)
  }

  useLayoutEffect(() => {
    calcLines()
  }, [connections, checked])

  useEffect(() => {
    window.addEventListener('resize', calcLines)
    return () => window.removeEventListener('resize', calcLines)
  }, [connections])

  function handleLeftClick(id: number) {
    if (checked) return
    setSelectedLeft((prev) => (prev === id ? null : id))
  }

  function handleRightClick(rightId: number) {
    if (checked || selectedLeft === null) return
    setConnections((prev) => {
      const next = new Map(prev)
      for (const [lId, rId] of next.entries()) {
        if (rId === rightId) next.delete(lId)
      }
      next.set(selectedLeft, rightId)
      return next
    })
    setSelectedLeft(null)
  }

  function handleRestart() {
    setShuffledRight(shuffle(pairs.map((p) => p.id)))
    setConnections(new Map())
    setSelectedLeft(null)
    setChecked(false)
    setLines([])
  }

  const correctCount = [...connections.entries()].filter(([lId, rId]) => lId === rId).length
  const allConnected = connections.size === pairs.length
  const selectedPair = pairs.find((p) => p.id === selectedLeft)

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-primary-600 hover:underline">
          ← Басты бет
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mt-2">
          Ойын — Жұптастыру
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Сол жақтан қимылды таңда, оң жақтан сәйкес дұғаны басып байланыстыр
        </p>
      </div>

      {/* Hint bar */}
      <div
        className={`mb-4 rounded-xl px-4 py-2.5 text-sm text-center font-medium transition-all duration-200 ${
          selectedPair
            ? 'bg-primary-50 border border-primary-200 text-primary-800'
            : 'bg-gray-50 border border-gray-200 text-gray-400'
        }`}
      >
        {selectedPair
          ? `«${selectedPair.left}» таңдалды — оң жақтан дұғаны баса байланыстыр`
          : 'Сол жақтан қимылды таңдаудан бастаңыз'}
      </div>

      {/* Game area */}
      <div ref={containerRef} className="relative">
        {/* SVG lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          aria-hidden="true"
        >
          <defs>
            {lines.map((l) => (
              <marker
                key={`arrow-${l.leftId}`}
                id={`dot-${l.leftId}`}
                markerWidth="6"
                markerHeight="6"
                refX="3"
                refY="3"
              >
                <circle
                  cx="3"
                  cy="3"
                  r="2.5"
                  fill={
                    checked
                      ? l.leftId === connections.get(l.leftId)
                        ? '#22c55e'
                        : '#ef4444'
                      : l.color
                  }
                />
              </marker>
            ))}
          </defs>
          {lines.map((l) => {
            const isCorrect = checked && l.leftId === connections.get(l.leftId)
            const stroke = checked ? (isCorrect ? '#22c55e' : '#ef4444') : l.color
            const mx = (l.x1 + l.x2) / 2
            return (
              <path
                key={l.leftId}
                d={`M ${l.x1} ${l.y1} C ${mx} ${l.y1}, ${mx} ${l.y2}, ${l.x2} ${l.y2}`}
                fill="none"
                stroke={stroke}
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={0.85}
                markerStart={`url(#dot-${l.leftId})`}
                markerEnd={`url(#dot-${l.leftId})`}
              />
            )
          })}
        </svg>

        {/* Two columns */}
        <div className="flex gap-10">
          {/* Left: movements */}
          <div className="flex-1 flex flex-col gap-2.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 text-center">
              Қимылдар
            </p>
            {pairs.map((pair) => {
              const isSelected = selectedLeft === pair.id
              const isConnected = connections.has(pair.id)
              const color = COLORS[(pair.id - 1) % COLORS.length]
              const isCorrect = checked && connections.get(pair.id) === pair.id
              const isWrong = checked && isConnected && !isCorrect

              return (
                <button
                  key={pair.id}
                  ref={(el) => { leftRefs.current[pair.id] = el }}
                  onClick={() => handleLeftClick(pair.id)}
                  disabled={checked}
                  className={[
                    'flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium w-full transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
                    isSelected
                      ? 'border-primary-500 bg-primary-50 shadow-md scale-[1.02]'
                      : isCorrect
                      ? 'border-green-400 bg-green-50'
                      : isWrong
                      ? 'border-red-400 bg-red-50'
                      : isConnected
                      ? 'border-gray-300 bg-white'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="text-lg flex-shrink-0">{pair.icon}</span>
                  <span className="leading-tight">{pair.left}</span>
                  {isConnected && !checked && (
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 ml-auto"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  {checked && (
                    <span className={`ml-auto text-base flex-shrink-0 ${isCorrect ? 'text-green-500' : 'text-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Right: duas (shuffled) */}
          <div className="flex-1 flex flex-col gap-2.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 text-center">
              Дұғалар
            </p>
            {shuffledRight.map((rightId) => {
              const pair = pairs.find((p) => p.id === rightId)!
              const connEntry = [...connections.entries()].find(([, rId]) => rId === rightId)
              const leftId = connEntry?.[0]
              const isConnected = leftId !== undefined
              const color = leftId !== undefined ? COLORS[(leftId - 1) % COLORS.length] : undefined
              const isCorrect = checked && leftId === rightId
              const isWrong = checked && isConnected && !isCorrect

              return (
                <button
                  key={rightId}
                  ref={(el) => { rightRefs.current[rightId] = el }}
                  onClick={() => handleRightClick(rightId)}
                  disabled={checked}
                  className={[
                    'flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium w-full transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
                    isCorrect
                      ? 'border-green-400 bg-green-50'
                      : isWrong
                      ? 'border-red-400 bg-red-50'
                      : isConnected
                      ? 'border-gray-300 bg-white'
                      : selectedLeft !== null
                      ? 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50 hover:shadow-sm'
                      : 'border-gray-200 bg-white',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {isConnected && !checked && (
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  <span className="italic text-gray-700 leading-tight">{pair.right}</span>
                  {checked && (
                    <span className={`ml-auto text-base flex-shrink-0 ${isCorrect ? 'text-green-500' : 'text-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={!allConnected}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {allConnected
              ? 'Тексеру'
              : `Барлығын байланыстыр (${connections.size} / ${pairs.length})`}
          </button>
        ) : (
          <div className="card text-center py-6">
            <p className="text-4xl mb-3">
              {correctCount === pairs.length ? '🎉' : correctCount >= 4 ? '👍' : '💪'}
            </p>
            <p className="text-xl font-bold text-gray-900 mb-1">
              {correctCount} / {pairs.length} дұрыс
            </p>
            <p className="text-gray-600 text-sm mb-5">
              {correctCount === pairs.length
                ? 'МашаАллаh! Барлық жұпты дұрыс таптың!'
                : correctCount >= 4
                ? 'Жақсы! Қайта байқап 100% жеткіз.'
                : 'Дұғаларды оқып қайта байқа!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleRestart} className="btn-primary">
                Қайтадан ойнау
              </button>
              <Link to="/duas" className="btn-secondary">
                Дұғаларды оқу →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
