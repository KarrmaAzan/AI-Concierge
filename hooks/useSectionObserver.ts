'use client'

import { useEffect } from 'react'

export const useSectionObserver = (callback: (id: string) => void) => {
  useEffect(() => {
    const sections = document.querySelectorAll('section')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry.target.id)
          }
        })
      },
      { threshold: 0.6 }
    )

    sections.forEach(sec => observer.observe(sec))

    return () => observer.disconnect()
  }, [])
}