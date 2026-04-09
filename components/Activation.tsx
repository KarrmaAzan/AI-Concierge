'use client'

import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPhase } from '@/store/slices/uiSlice'
import { YinYang } from '@/components/YinYang'

type ActivationProps = {
  onActivated?: () => void | Promise<void>
}

export default function Activation({ onActivated }: ActivationProps) {
  const dispatch = useDispatch()
  const [clicked, setClicked] = useState(false)
  const [booting, setBooting] = useState(false)

  const start = async () => {
    if (clicked || booting) return

    setBooting(true)
    setClicked(true)
    dispatch(setPhase('booting'))

    await new Promise((r) => setTimeout(r, 1200))

    dispatch(setPhase('active'))
    await onActivated?.()
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        pointerEvents: clicked ? 'none' : 'auto',
      }}
    >
      <motion.div
        initial={false}
        animate={{ opacity: clicked ? 0 : 1 }}
        transition={{ duration: 0.55, delay: clicked ? 0.95 : 0 }}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(20,20,28,0.24), rgba(5,5,8,0.86) 62%, rgba(0,0,0,0.96) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      />

      <motion.button
        type="button"
        onClick={start}
        initial={false}
        animate={{
          top: clicked ? '90%' : '50%',
          left: clicked ? '93%' : '50%',
          x: '-50%',
          y: '-50%',
          scale: clicked ? 0.5 : 1,
        }}
        whileTap={!clicked ? { scale: 0.94 } : undefined}
        transition={{
          duration: 1.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: 'absolute',
          zIndex: 3,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          cursor: clicked ? 'default' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: clicked ? 6 : 1.6,
            ease: 'linear',
            repeat: Infinity,
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <YinYang
            width={clicked ? 120 : 220}
            height={clicked ? 120 : 220}
            fill="currentColor"
          />
        </motion.div>

        {!clicked && (
          <Typography
            sx={{
              mt: 2,
              fontSize: 14,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.76)',
            }}
          >
            Activate AMHRL
          </Typography>
        )}
      </motion.button>
    </Box>
  )
}