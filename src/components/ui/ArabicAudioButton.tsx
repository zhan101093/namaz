import { useState, useEffect, useCallback, useRef } from 'react'

interface ArabicAudioButtonProps {
  text: string
  className?: string
}

function cleanForTTS(arabic: string): string {
  return arabic
    .replace(/[۝﷽]/g, ' ')
    .replace(/[،؛]/g, ',')
    .replace(/\./g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getArabicVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === 'ar-SA') ??
    voices.find((v) => v.lang.startsWith('ar')) ??
    null
  )
}

export function ArabicAudioButton({ text, className = '' }: ArabicAudioButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    setSupported(true)

    // Voices load asynchronously — trigger a load
    window.speechSynthesis.getVoices()
    const onVoicesChanged = () => setSupported(true)
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
      window.speechSynthesis.cancel()
      if (keepAliveRef.current) clearInterval(keepAliveRef.current)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!window.speechSynthesis) return

    if (speaking) {
      window.speechSynthesis.cancel()
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current)
        keepAliveRef.current = null
      }
      setSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(cleanForTTS(text))
    utterance.lang = 'ar-SA'
    utterance.rate = 0.7
    utterance.pitch = 1.0

    const voice = getArabicVoice()
    if (voice) utterance.voice = voice

    utterance.onstart = () => {
      setSpeaking(true)
      // Chrome stops after ~15s — pause/resume workaround
      keepAliveRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause()
          window.speechSynthesis.resume()
        }
      }, 10000)
    }

    utterance.onend = () => {
      setSpeaking(false)
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current)
        keepAliveRef.current = null
      }
    }

    utterance.onerror = () => {
      setSpeaking(false)
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current)
        keepAliveRef.current = null
      }
    }

    // Voices may still be loading — wait if empty
    const trySpeak = () => {
      const voice2 = getArabicVoice()
      if (voice2) utterance.voice = voice2
      window.speechSynthesis.speak(utterance)
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', trySpeak, { once: true })
    } else {
      trySpeak()
    }
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
