import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cloux - Automate Credentialing. Accelerate Revenue.',
  description: 'AI-powered platform that automates credentialing workflows for small healthcare practices, starting with dental, to get providers billing faster and reduce administrative burden.',
  keywords: 'healthcare, credentialing, AI, automation, dental practices, medical billing',
  authors: [{ name: 'Cloux Team' }],
  openGraph: {
    title: 'Cloux - Automate Credentialing. Accelerate Revenue.',
    description: 'AI-powered credentialing automation for healthcare practices',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  )
}