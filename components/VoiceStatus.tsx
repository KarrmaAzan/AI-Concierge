'use client'

import { Box, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useAudio } from '@/providers/AudioProvider'

export default function VoiceStatus() {
  const { voiceError } = useAudio()

  return (
    <AnimatePresence>
      {voiceError && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            top: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1500,
            width: 'min(760px, calc(100vw - 24px))',
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.25,
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(10,10,14,0.76)',
              backdropFilter: 'blur(12px)',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '0.92rem', md: '1rem' },
                color: 'rgba(255,255,255,0.84)',
              }}
            >
              {voiceError}
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}