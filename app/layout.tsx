import './globals.css'
import Providers from '@/providers/Providers'

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}