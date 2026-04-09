'use client'

import { Typography } from '@mui/material'
import { useAudio } from '@/providers/AudioProvider'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Subtitles() {
  const { subtitle, currentKey } = useAudio()
  const [displayedText, setDisplayedText] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (!subtitle) {
      setDisplayedText('')
      return
    }

    let index = 0
    setDisplayedText('')

    const typeNext = () => {
      index++
      setDisplayedText(subtitle.slice(0, index))

      if (index >= subtitle.length) return

      const char = subtitle[index - 1]

      // 🔥 cinematic pacing
      let delay = 45

      if (char === ' ') delay = 20
      if (char === ',') delay = 140
      if (char === '.') delay = 220
      if (char === '!' || char === '?') delay = 260
      if (char === ':') delay = 180

      timeoutRef.current = setTimeout(typeNext, delay)
    }

    // slight delay before starting (feels intentional)
    timeoutRef.current = setTimeout(typeNext, 180)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [subtitle, currentKey])

  return (
    <AnimatePresence mode="wait">
      {subtitle && (
        <motion.div
          key={currentKey || subtitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'fixed',
            bottom: '12%',
            left: '25%',
            transform: 'translateX(-50%)',
            width: 'min(900px, 90vw)',
            zIndex: 1400,
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              fontWeight: 600,
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
              color: '#ffffff',
            }}
          >
            {displayedText}
            <span
              style={{
                marginLeft: 4,
                opacity: 0.8,
                animation: 'amhrlBlink 1.2s infinite',
              }}
            >
              |
            </span>
          </Typography>
        </motion.div>
      )}
    </AnimatePresence>
  )
}