'use client'

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  GlobalStyles,
} from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'transparent',
      paper: 'rgba(10,12,20,0.7)',
    },
  },
})

export default function ThemeProviderWrapper({ children }: any) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <GlobalStyles
        styles={{
          html: {
            backgroundColor: 'transparent',
          },
          body: {
            backgroundColor: 'transparent',
          },
        }}
      />
      {children}
    </ThemeProvider>
  )
}