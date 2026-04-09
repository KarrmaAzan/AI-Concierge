'use client'

import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <Box
      component="section"
      id="hero"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.05), transparent 22%), radial-gradient(circle at 80% 30%, rgba(120,120,255,0.10), transparent 20%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.035), transparent 32%)',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          width: '100%',
          maxWidth: 1280,
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <Typography
            sx={{
              fontSize: 14,
              textTransform: 'uppercase',
              letterSpacing: '0.28em',
              color: 'rgba(255,255,255,0.54)',
              mb: 2,
            }}
          >
            AI-guided acquisition
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '3.4rem', md: '7rem' },
              lineHeight: 0.94,
              letterSpacing: '-0.06em',
              fontWeight: 800,
              maxWidth: 980,
              mb: 3,
            }}
          >
            A landing experience that speaks, guides, and converts.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.9,
              maxWidth: 760,
            }}
          >
            AMHRL combines interface, narration, motion, and persuasion into a client
            acquisition system that feels like a real product from the first second.
          </Typography>
        </motion.div>
      </Box>
    </Box>
  )
}