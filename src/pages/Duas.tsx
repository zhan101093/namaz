import { useState } from 'react'
import { Link } from 'react-router-dom'
import { duas } from '../data/duas'
import { ArabicAudioButton } from '../components/ui/ArabicAudioButton'

export function Duas() {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-primary-600 hover:underline">
          ← Басты бет
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mt-2">
          3-бөлім: Намаздағы дұғалар
        </h1>
        <p className="text-gray-600 mt-1">
          Намаздың әр кезеңіндегі дұғалар — арабша, транслитерация және қазақша мағынасы
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {duas.map((dua) => {
          const isOpen = expanded === dua.id

          return (
            <div key={dua.id} className="card p-0 overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : dua.id)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {dua.id}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="font-medium text-gray-900 text-sm">{dua.position}</span>
                    {dua.repeats && (
                      <span className="text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-200 rounded-full px-2 py-0.5 flex-shrink-0">
                        {dua.repeats} рет
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-primary-500 transition-transform duration-200 flex-shrink-0 text-xs ${isOpen ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3 flex flex-col gap-3">

                  {/* Arabic */}
                  <div className="bg-primary-50 rounded-2xl px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                        Арабша
                      </p>
                      <ArabicAudioButton text={dua.arabic} />
                    </div>
                    <p
                      className="text-primary-950 text-center"
                      style={{
                        fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
                        fontSize: '1.55rem',
                        lineHeight: '2.2',
                        direction: 'rtl',
                        fontWeight: 500,
                      }}
                    >
                      {dua.arabic}
                    </p>
                    {dua.repeats && (
                      <p className="text-xs text-primary-500 mt-2 text-center font-medium">
                        ({dua.repeats} рет қайталанады)
                      </p>
                    )}
                  </div>

                  {/* Transliteration */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Оқылуы
                    </p>
                    <p className="text-gray-800 italic text-sm leading-relaxed">
                      {dua.transliteration}
                    </p>
                  </div>

                  {/* Translation */}
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1.5">
                      Қазақша мағынасы
                    </p>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {dua.translation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <Link to="/movements" className="btn-secondary">
          ← Қимылдар
        </Link>
        <Link to="/practice" className="btn-primary">
          Практикаға өту →
        </Link>
      </div>
    </main>
  )
}
