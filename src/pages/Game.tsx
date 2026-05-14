import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { quizQuestions } from '../data/quiz'
import { ProgressBar } from '../components/ui/ProgressBar'

type GameState = 'intro' | 'playing' | 'answered' | 'result'

const TIMER_SECONDS = 30

export function Game() {
  const [gameState, setGameState] = useState<GameState>('intro')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [answers, setAnswers] = useState<(number | null)[]>([])

  const question = quizQuestions[current]

  const handleTimeout = useCallback(() => {
    if (gameState !== 'playing') return
    setAnswers((prev) => [...prev, null])
    setGameState('answered')
  }, [gameState])

  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) {
      handleTimeout()
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [gameState, timeLeft, handleTimeout])

  function startGame() {
    setGameState('playing')
    setCurrent(0)
    setScore(0)
    setTimeLeft(TIMER_SECONDS)
    setSelected(null)
    setAnswers([])
  }

  function handleAnswer(idx: number) {
    if (gameState !== 'playing') return
    setSelected(idx)
    setAnswers((prev) => [...prev, idx])
    if (idx === question.correctIndex) setScore((s) => s + 1)
    setGameState('answered')
  }

  function handleNext() {
    if (current < quizQuestions.length - 1) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setTimeLeft(TIMER_SECONDS)
      setGameState('playing')
    } else {
      setGameState('result')
    }
  }

  const scorePercent = Math.round((score / quizQuestions.length) * 100)

  function getResultEmoji() {
    if (scorePercent >= 80) return '🏆'
    if (scorePercent >= 60) return '⭐'
    if (scorePercent >= 40) return '💪'
    return '📚'
  }

  function getResultMsg() {
    if (scorePercent >= 80) return 'Керемет! Намаз туралы жақсы білесіз!'
    if (scorePercent >= 60) return 'Жақсы нәтиже! Тағы да қайталаңыз.'
    if (scorePercent >= 40) return 'Тырысыңыз, тағы оқып шығыңыз!'
    return 'Алдыңғы бөлімдерді тағы бір рет оқып шықсаңыз болар.'
  }

  // Intro screen
  if (gameState === 'intro') {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-sm text-primary-600 hover:underline">
            ← Басты бет
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mt-2">
            6-бөлім: Ойын — Викторина
          </h1>
        </div>
        <div className="card text-center py-10">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Намаз туралы викторина</h2>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            {quizQuestions.length} сұрақ. Әр сұраққа {TIMER_SECONDS} секунд беріледі.
            Өз білімін тексер!
          </p>
          <div className="flex flex-col gap-2 items-center text-sm text-gray-500 mb-6">
            <p>✅ Дұрыс жауап — 1 ұпай</p>
            <p>⏰ Уақыт бітсе — 0 ұпай</p>
            <p>🏆 Максимум — {quizQuestions.length} ұпай</p>
          </div>
          <button onClick={startGame} className="btn-primary text-lg px-8 py-3">
            Бастау →
          </button>
        </div>
      </main>
    )
  }

  // Result screen
  if (gameState === 'result') {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="card text-center py-10">
          <div className="text-6xl mb-3">{getResultEmoji()}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Нәтиже</h2>
          <p className="text-4xl font-bold text-primary-700 mb-1">
            {score} / {quizQuestions.length}
          </p>
          <p className="text-gray-600 mb-6">{getResultMsg()}</p>

          <ProgressBar current={score} total={quizQuestions.length} />

          {/* Answer review */}
          <div className="mt-6 flex flex-col gap-2 text-left">
            {quizQuestions.map((q, i) => {
              const userAnswer = answers[i]
              const correct = userAnswer === q.correctIndex
              return (
                <div
                  key={q.id}
                  className={`rounded-xl p-3 border text-sm ${
                    correct
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex gap-2 items-start">
                    <span>{correct ? '✅' : '❌'}</span>
                    <div>
                      <p className="font-medium text-gray-800">{q.question}</p>
                      {!correct && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Дұрыс жауап: {q.options[q.correctIndex]}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5 italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={startGame} className="btn-primary">
              Қайта ойнау
            </button>
            <Link to="/" className="btn-secondary">
              Басты бетке
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Playing / Answered
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/" className="text-sm text-primary-600 hover:underline">
          ← Басты бет
        </Link>
        <h1 className="text-2xl font-bold text-primary-900 mt-2">
          6-бөлім: Ойын
        </h1>
      </div>

      <div className="flex items-center justify-between mb-3">
        <ProgressBar current={current + 1} total={quizQuestions.length} label="Сұрақ" />
        <div
          className={`ml-4 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-colors ${
            timeLeft > 10
              ? 'border-primary-400 text-primary-700 bg-primary-50'
              : 'border-red-400 text-red-600 bg-red-50'
          }`}
        >
          {timeLeft}
        </div>
      </div>

      <div className="card mt-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {current + 1}-сұрақ
          </span>
          <span className="text-xs text-gray-400">
            Ұпай: {score}
          </span>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-5">{question.question}</h2>

        <div className="flex flex-col gap-2">
          {question.options.map((opt, idx) => {
            let style = 'border-gray-200 bg-white hover:border-primary-400 hover:bg-primary-50'
            if (gameState === 'answered') {
              if (idx === question.correctIndex) {
                style = 'border-green-400 bg-green-50'
              } else if (idx === selected && selected !== question.correctIndex) {
                style = 'border-red-400 bg-red-50'
              } else {
                style = 'border-gray-200 bg-white opacity-60'
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={gameState === 'answered'}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150 ${style} disabled:cursor-default`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    gameState === 'answered' && idx === question.correctIndex
                      ? 'bg-green-500 text-white'
                      : gameState === 'answered' && idx === selected
                      ? 'bg-red-400 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm text-gray-800">{opt}</span>
              </button>
            )
          })}
        </div>

        {gameState === 'answered' && (
          <div className="mt-4 bg-primary-50 border border-primary-100 rounded-xl p-3">
            <p className="text-sm text-primary-800">{question.explanation}</p>
          </div>
        )}

        {gameState === 'answered' && (
          <div className="mt-4 text-right">
            <button onClick={handleNext} className="btn-primary">
              {current < quizQuestions.length - 1 ? 'Келесі сұрақ →' : 'Нәтижені көру →'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
