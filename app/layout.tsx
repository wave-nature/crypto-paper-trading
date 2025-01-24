import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Paper Trading',
  description: 'A simple paper trading app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
