'use client'

import { createContext, useContext, useRef, useState } from 'react'

type AudioContextType = {
  subtitle: string
  currentKey: string | null
  isPlaying: boolean
  voiceError: string | null
  play: (key: string, text: string) => Promise<boolean>
  stop: () => void
  clearVoiceError: () => void
}

const AudioContext = createContext<AudioContextType | null>(null)

const staticAudioMap: Record<string, string> = {
  intro: '/audio/intro.mp3',
  hero: '/audio/hero.mp3',
  services: '/audio/services.mp3',
  deliverables: '/audio/deliverables.mp3',
  process: '/audio/process.mp3',
  proof: '/audio/proof.mp3',
  cta: '/audio/cta.mp3',
}

export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [subtitle, setSubtitle] = useState('')
  const [currentKey, setCurrentKey] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)

  const clearVoiceError = () => setVoiceError(null)

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.onended = null
      audioRef.current.onerror = null
    }
    setIsPlaying(false)
  }

  const play = async (key: string, text: string) => {
    try {
      clearVoiceError()
      stop()
      setSubtitle(text)
      setCurrentKey(key)

      const source = staticAudioMap[key]
      const audio = source ? new Audio(source) : new Audio()

      if (!source) {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error('TTS request failed:', res.status, errorText)
          setVoiceError('Voice is temporarily unavailable. You can still continue scrolling.')
          return false
        }

        const contentType = res.headers.get('content-type') || ''
        if (!contentType.includes('audio')) {
          const badText = await res.text()
          console.error('TTS returned non-audio:', badText)
          setVoiceError('Voice is temporarily unavailable. You can still continue scrolling.')
          return false
        }

        const blob = await res.blob()
        if (!blob.size) {
          console.error('Empty audio blob returned')
          setVoiceError('Voice is temporarily unavailable. You can still continue scrolling.')
          return false
        }

        const url = URL.createObjectURL(blob)
        audio.src = url
      }

      audioRef.current = audio
      setIsPlaying(true)

      await audio.play()

      await new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          setIsPlaying(false)
          resolve()
        }
        audio.onerror = () => {
          setIsPlaying(false)
          reject(new Error('Audio playback failed'))
        }
      })

      return true
    } catch (error) {
      console.error('Audio playback failed:', error)
      setIsPlaying(false)
      setVoiceError('Voice is temporarily unavailable. You can still continue scrolling.')
      return false
    }
  }

  return (
    <AudioContext.Provider
      value={{
        subtitle,
        currentKey,
        isPlaying,
        voiceError,
        play,
        stop,
        clearVoiceError,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) {
    throw new Error('useAudio must be used inside AudioProvider')
  }
  return ctx
}