'use client'

import { Box, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'

type IntroGreetingProps = {
  text: string
}

const splitIntoSentences = (text: string) => {
  return text
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? []
}

export default function IntroGreeting({ text }: IntroGreetingProps) {
  const sentences = useMemo(() => splitIntoSentences(text), [text])

  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (!sentences.length) {
      setDisplayedText('')
      return
    }

    let charIndex = 0
    const currentSentence = sentences[sentenceIndex]
    setDisplayedText('')

    const typeNext = () => {
      charIndex += 1
      setDisplayedText(currentSentence.slice(0, charIndex))

      if (charIndex < currentSentence.length) {
        const char = currentSentence[charIndex - 1]

        let delay = 55
        if (char === ' ') delay = 18
        if (char === ',') delay = 130
        if (char === '.') delay = 240
        if (char === '!' || char === '?') delay = 280
        if (char === ':') delay = 180

        timeoutRef.current = setTimeout(typeNext, delay)
        return
      }

      const holdTime = 900

      timeoutRef.current = setTimeout(() => {
        if (sentenceIndex < sentences.length - 1) {
          setDisplayedText('')
          setSentenceIndex((prev) => prev + 1)
        }
      }, holdTime)
    }

    timeoutRef.current = setTimeout(typeNext, 180)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [sentenceIndex, sentences])

  useEffect(() => {
    setSentenceIndex(0)
    setDisplayedText('')
  }, [text])

  return (
    <Box
     sx={{
  position: 'fixed',
  inset: 0,
  zIndex: 1300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: 3,
  background:
    'radial-gradient(circle at 15% 10%, rgba(124, 92, 255, 0.32), transparent 28%), radial-gradient(circle at 85% 20%, rgba(255, 255, 255, 0.08), transparent 22%), radial-gradient(circle at 50% 90%, rgba(120, 120, 255, 0.22), transparent 34%), linear-gradient(180deg, rgba(18,24,38,0.98) 0%, rgba(11,15,26,0.98) 45%, rgba(7,9,15,0.98) 100%)',
}}
    >
      <Box
        sx={{
          width: 'min(1100px, 92vw)',
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: '1.8rem',
              sm: '2.3rem',
              md: '3rem',
              lg: '3.6rem',
            },
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: '-0.02em',
            color: '#fff',
            minHeight: {
              xs: '4.5rem',
              sm: '5.5rem',
              md: '7rem',
              lg: '8rem',
            },
          }}
        >
          {displayedText}
          {displayedText && (
            <span
              style={{
                marginLeft: 4,
                opacity: 0.8,
                animation: 'amhrlBlink 1.2s infinite',
              }}
            >
              |
            </span>
          )}
        </Typography>
      </Box>
    </Box>
  )
}