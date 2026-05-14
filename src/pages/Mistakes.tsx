import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mistakes } from '../data/mistakes'

export function Mistakes() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-primary-600 hover:underline">
          ← Басты бет
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mt-2">
          5-бөлім: Жиі жіберілетін қателер
        </h1>
        <p className="text-gray-600 mt-1">
          Намаз оқушылардың жиі жіберетін {mistakes.length} қатесі және оны түзету жолы
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {mistakes.map((mistake) => {
          const isOpen = expanded === mistake.id

          return (
            <div
              key={mistake.id}
              className="card p-0 overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : mistake.id)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">⚠️</span>
                  <span className="font-medium text-gray-900 text-sm">{mistake.title}</span>
                </div>
                <span
                  className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3 flex flex-col gap-3">
                  {/* Wrong */}
                  <div className="flex gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">❌</span>
                    <div>
                      <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-0.5">
                        Қате
                      </p>
                      <p className="text-sm text-gray-700">{mistake.wrong}</p>
                    </div>
                  </div>

                  {/* Correct */}
                  <div className="flex gap-3 bg-green-50 border border-green-100 rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">✅</span>
                    <div>
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-0.5">
                        Дұрысы
                      </p>
                      <p className="text-sm text-gray-700">{mistake.correct}</p>
                    </div>
                  </div>

                  {/* Tip */}
                  <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">💡</span>
                    <p className="text-sm text-gray-700">{mistake.tip}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <Link to="/practice" className="btn-secondary">
          ← Практика
        </Link>
        <Link to="/game" className="btn-primary">
          Ойынға өту →
        </Link>
      </div>
    </main>
  )
}
