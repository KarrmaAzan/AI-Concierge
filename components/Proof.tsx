'use client'

import { Box, Typography } from '@mui/material'

export default function Proof() {
  return (
    <Box
      component="section"
      id="proof"
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
          Why this works.
        </Typography>

        <Typography sx={{ maxWidth: 760, color: 'rgba(255,255,255,0.74)', lineHeight: 1.8 }}>
          The difference is alignment. When the product, the visual language, the copy,
          and the interaction model support each other, the business feels stronger.
        </Typography>
      </Box>
    </Box>
  )
}