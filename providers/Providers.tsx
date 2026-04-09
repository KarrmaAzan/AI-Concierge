'use client'

import ReduxProvider from './ReduxProvider'
import ThemeProviderWrapper from './ThemeProvider'
import AudioProvider from './AudioProvider'

export default function Providers({ children }: any) {
  return (
    <ReduxProvider>
      <ThemeProviderWrapper>
        <AudioProvider>{children}</AudioProvider>
      </ThemeProviderWrapper>
    </ReduxProvider>
  )
}