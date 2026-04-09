'use client'

import { Box, Typography } from '@mui/material'

export default function Deliverables() {
  return (
    <Box
      component="section"
      id="deliverables"
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
          Deliverables that behave like a system.
        </Typography>

        <Typography sx={{ maxWidth: 760, color: 'rgba(255,255,255,0.74)', lineHeight: 1.8 }}>
          You are not getting random design files and hoping it all works later. You are
          getting strategy, interface, flow, implementation, and conversion structure
          working together.
        </Typography>
      </Box>
    </Box>
  )
}