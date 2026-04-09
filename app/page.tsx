'use client'

import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { useAudio } from '@/providers/AudioProvider'
import { useDispatch } from 'react-redux'
import { markViewed } from '@/store/slices/uiSlice'
import { logEvent } from '@/lib/analytics'

import Activation from '@/components/Activation'
import IntroGreeting from '@/components/IntroGreeting'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Deliverables from '@/components/Deliverables'
import Process from '@/components/Process'
import Proof from '@/components/Proof'
import CTA from '@/components/CTA'
import Subtitles from '@/components/SubtitleOverlay'
import VoiceStatus from '@/components/VoiceStatus'

const introText =
  'Welcome to AMHRL. This is a guided client acquisition experience. Scroll down after this introduction. I will walk you through each part of the system.'

const narrationMap: Record<string, string> = {
  hero: 'This is where the experience begins. AMHRL is designed to feel like a real product, not a static landing page. It introduces the offer with clarity, tone, and intent.',
  services:
    'Here you choose what you actually need. Whether it is a website, a web app, or an AI system, the goal is to shape the build around your business instead of forcing your business into a generic template.',
  deliverables:
    'The deliverables are not random assets. You get a complete system built to attract attention, guide the visitor, and move the right people toward action.',
  process:
    'This section explains how the work gets done. First we define the right system, then we design the experience, then we build the product around what makes the most sense to launch first.',
  proof:
    'This works because the interface, the story, and the offer all align. When those pieces are coherent, the product feels stronger and the business feels more trustworthy.',
  cta:
    'This is the decision point. You can explore more work, or book a call and I will help you map out what your business actually needs to build next.',
}

export default function Page() {
  const { play, currentKey } = useAudio()
  const dispatch = useDispatch()

  const [activated, setActivated] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [introFinished, setIntroFinished] = useState(false)

  const activeSectionRef = useRef<string | null>(null)
  const lastTriggerAtRef = useRef<number>(0)

  const handleActivated = async () => {
    setActivated(true)
    setShowIntro(true)

    await play('intro', introText)

    setShowIntro(false)
    setIntroFinished(true)
  }

  useEffect(() => {
    if (!activated || !introFinished) return

    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))

    const observer = new IntersectionObserver(
      async (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (!visibleEntries.length) return

        const topEntry = visibleEntries[0]
        const id = topEntry.target.id

        if (!id || !narrationMap[id]) return

        const now = Date.now()

        if (activeSectionRef.current === id && currentKey === id) return
        if (now - lastTriggerAtRef.current < 700) return

        activeSectionRef.current = id
        lastTriggerAtRef.current = now

        dispatch(markViewed(id))
        void logEvent({
          type: 'section_viewed',
          metadata: { section: id },
        })

        await play(id, narrationMap[id])
      },
      {
        threshold: [0.35, 0.5, 0.65, 0.8],
        rootMargin: '-10% 0px -10% 0px',
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [activated, introFinished, play, currentKey, dispatch])

  return (
    <>
      {!activated && <Activation onActivated={handleActivated} />}
      {showIntro && <IntroGreeting text={introText} />}

      {introFinished && (
        <Box>
          <Hero />
          <Services />
          <Deliverables />
          <Process />
          <Proof />
          <CTA />
          <Subtitles />
          <VoiceStatus />
        </Box>
      )}
    </>
  )
}