import { useState, useEffect, useCallback } from 'react'

interface ArabicAudioButtonProps {
  text: string
  className?: string
}

function cleanForTTS(arabic: string): string {
  return arabic
    .replace(/[۝﷽]/g, ' ')
    .replace(/[،؛]/g, ',')
    .replace(/\s+/g, ' ')
    .trim()
}

export function ArabicAudioButton({ text, className = '' }: ArabicAudioButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported('speechSynthesis' in window)
    return () => { window.speechSynthesis?.cancel() }
  }, [])

  const handleClick = useCallback(() => {
    if (!window.speechSynthesis) return

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(cleanForTTS(text))
    utterance.lang = 'ar-SA'
    utterance.rate = 0.72
    utterance.pitch = 1.0

    const voices = window.speechSynthesis.getVoices()
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'))
    if (arabicVoice) utterance.voice = arabicVoice

    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }, [text, speaking])

  if (!supported) return null

  return (
    <button
      onClick={handleClick}
      aria-label={speaking ? 'Тоқтату' : 'Дұғаны тыңдау'}
      title={speaking ? 'Тоқтату' : 'Дұғаны тыңдау'}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 select-none ${
        speaking
          ? 'bg-red-100 text-red-600 hover:bg-red-200 active:scale-95'
          : 'bg-primary-100 text-primary-700 hover:bg-primary-200 active:scale-95'
      } ${className}`}
    >
      {speaking ? (
        <>
          <span className="w-3 h-3 rounded-sm bg-red-500 animate-pulse inline-block" />
          Тоқтату
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          Тыңдау
        </>
      )}
    </button>
  )
}
