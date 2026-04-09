'use client'

import { Box, Typography } from '@mui/material'

export default function Process() {
  return (
    <Box
      component="section"
      id="process"
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
            mb: 3,
          }}
        >
          A cleaner process from idea to launch.
        </Typography>

        <Typography sx={{ maxWidth: 760, color: 'rgba(255,255,255,0.74)', lineHeight: 1.8 }}>
          We define what needs to be built, design the experience around the offer, and
          implement the system so it is usable, trackable, and scalable.
        </Typography>
      </Box>
    </Box>
  )
}