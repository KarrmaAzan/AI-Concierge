'use client'

import { Box, Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setSelectedService } from '@/store/slices/uiSlice'

const services = ['Website', 'Web App', 'AI System', 'Sales Funnel']

export default function Services() {
  const dispatch = useDispatch()
  const selectedService = useSelector((s: RootState) => s.ui.selectedService)

  const chooseService = async (service: string) => {
    dispatch(setSelectedService(service))
      const cta = document.getElementById('cta')
  if (cta) {
    cta.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'service_selected',
          metadata: { service },
        }),
      })
    } catch (error) {
      console.error('Failed to log service selection', error)
    }
  }

  return (
    <Box
      component="section"
      id="services"
      sx={{
        minHeight: '100vh',
        px: 3,
        py: 10,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        <Typography
          sx={{
            fontSize: { xs: '2rem', md: '4rem' },
            fontWeight: 700,
            letterSpacing: '-0.05em',
            mb: 2,
          }}
        >
          Choose what you need.
        </Typography>

        <Typography
          sx={{
            maxWidth: 760,
            color: 'rgba(255,255,255,0.74)',
            lineHeight: 1.8,
            mb: 5,
          }}
        >
          The goal is not to throw generic packages at you. The goal is to shape the
          right system around what your business actually needs.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          {services.map((service) => {
            const active = selectedService === service

            return (
              <Box
                key={service}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: active
                    ? '1px solid rgba(255,255,255,0.32)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: active
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(255,255,255,0.03)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  {service}
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.72)',
                    lineHeight: 1.7,
                    mb: 3,
                  }}
                >
                  Built with real business goals in mind, not generic template logic.
                </Typography>

                <Button
                  variant={active ? 'contained' : 'outlined'}
                  onClick={() => chooseService(service)}
                >
                  {active ? 'Selected' : 'Select'}
                </Button>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}