'use client'

import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

import type { RootState } from '@/store/store'
import { logEvent, getSessionId } from '@/lib/analytics'

type LeadResponse = {
  success: boolean
  lead?: {
    id: string
  }
  error?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function CTA() {
  const router = useRouter()
  const selectedService = useSelector(
    (state: RootState) => state.ui.selectedService
  )

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'error'>('idle')
  const [validationError, setValidationError] = useState('')

  const effectiveService = useMemo(
    () => selectedService || 'Unspecified',
    [selectedService]
  )

  const saveLead = async () => {
    if (!email.trim()) {
      setValidationError('Email is required.')
      return null
    }

    if (!isValidEmail(email.trim())) {
      setValidationError('Enter a valid email address.')
      return null
    }

    setValidationError('')

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        company,
        notes,
        service: effectiveService,
        sessionId: getSessionId(),
      }),
    })

    const data = (await response.json()) as LeadResponse

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to save lead')
    }

    return data.lead?.id ?? null
  }

  const handleSeeMore = async () => {
    setIsSubmitting(true)
    setSubmitState('idle')

    try {
      const leadId = await saveLead()
      if (!leadId) {
        setIsSubmitting(false)
        return
      }

      await logEvent({
        type: 'see_more_clicked',
        leadId,
        metadata: {
          selectedService: effectiveService,
        },
      })

      router.push('https://iamjordangolden.com')
    } catch {
      setSubmitState('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBookCall = async () => {
    setIsSubmitting(true)
    setSubmitState('idle')

    try {
      const leadId = await saveLead()
      if (!leadId) {
        setIsSubmitting(false)
        return
      }

      await logEvent({
        type: 'book_clicked',
        leadId,
        metadata: {
          selectedService: effectiveService,
        },
      })

      const url = new URL(process.env.NEXT_PUBLIC_CALENDLY_URL!)

      if (email.trim()) url.searchParams.set('email', email.trim())
      if (name.trim()) url.searchParams.set('name', name.trim())
      url.searchParams.set('a1', effectiveService)

      window.open(url.toString(), '_blank', 'noopener,noreferrer')
    } catch {
      setSubmitState('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      component="section"
      id="cta"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 10, md: 14 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.24 }}
          transition={{ duration: 0.65 }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 5,
              border: '1px solid rgba(255,255,255,0.08)',
              background:
                'radial-gradient(circle at 20% 10%, rgba(124,92,255,0.22), transparent 26%), linear-gradient(180deg, rgba(18,22,36,0.95), rgba(10,12,20,0.9))',
              boxShadow: '0 30px 90px rgba(0,0,0,0.34)',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' },
                gap: { xs: 4, md: 6 },
                alignItems: 'start',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.52)',
                    mb: 2,
                  }}
                >
                  Call to action
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: '2.2rem', md: '4.2rem' },
                    lineHeight: 0.98,
                    letterSpacing: '-0.05em',
                    fontWeight: 800,
                    mb: 2.5,
                    maxWidth: 620,
                  }}
                >
                  Let’s turn this into your system.
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.72)',
                    lineHeight: 1.85,
                    maxWidth: 560,
                    mb: 3,
                  }}
                >
                  Your selected service is{' '}
                  <strong style={{ color: '#fff' }}>{effectiveService}</strong>. Enter your
                  details and continue to my portfolio or book a call.
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  error={Boolean(validationError)}
                  helperText={validationError || 'Required to continue'}
                />
                <TextField
                  fullWidth
                  label="Company"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
                <TextField
                  fullWidth
                  label="What are you trying to build?"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  multiline
                  minRows={4}
                />

                {submitState === 'error' ? (
                  <Alert severity="error">
                    Something went wrong while saving your info. Try again.
                  </Alert>
                ) : null}

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    pt: 1,
                  }}
                >
                  <Button
                    onClick={handleSeeMore}
                    variant="outlined"
                    size="large"
                    disabled={isSubmitting}
                  >
                    Explore My Work
                  </Button>

                  <Button
                    onClick={handleBookCall}
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                  >
                    Book a Call
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}