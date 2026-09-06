import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import ScrollProgressBar from '@/components/ui/scroll-progress-bar'
import { Providers } from './providers'
import { getProfile } from '@/lib/services/profile.service'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
})

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Muhammad Arkan Mariadi — Full-Stack Developer (4RK4N.DEV)',
  description: 'Full-stack developer building production web applications with Next.js, React, Nest.js, and Laravel.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${geistMono.variable} font-sans overflow-x-hidden antialiased bg-background text-text-primary min-h-screen flex flex-col`}>
        <Providers>
          <ScrollProgressBar />
          <SmoothCursor />
          <Navbar />
         
          {children}
          <Footer profile={profile} />
        </Providers>
      </body>
    </html>
  )
}
