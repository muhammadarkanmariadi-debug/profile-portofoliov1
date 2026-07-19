import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TargetCursor from '@/components/TargetCursor'
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
  title: 'Portfolio - Arkan Mariadi',
  description: 'Junior Fullstack Web Developer Portfolio'
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
          <Navbar />
          <TargetCursor targetSelector=".cursor-target, .admin-panel h1, .admin-panel h2, .admin-panel h3, .admin-panel p, .admin-panel a, .admin-panel button, .admin-panel span, .admin-panel label, .admin-panel th, .admin-panel td" />
          {children}
          <Footer profile={profile} />
        </Providers>
      </body>
    </html>
  )
}
