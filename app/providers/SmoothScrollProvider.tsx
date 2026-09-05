'use client'
import React, { useEffect, createContext, useContext, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { usePathname } from 'next/navigation'

gsap.registerPlugin(ScrollTrigger)

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: Record<string, unknown>) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {}
})

export const useSmoothScroll = () => useContext(SmoothScrollContext)

export const SmoothScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Disable Lenis on Admin panel routes to allow native dashboard scroll & drag-drop
    if (pathname?.startsWith('/admin')) {
      if (lenisInstance) {
        lenisInstance.destroy()
        setLenisInstance(null)
      }
      return
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      infinite: false,
      prevent: (node) => {
        return node.hasAttribute('data-lenis-prevent') || node.closest('[data-lenis-prevent]') !== null
      }
    })

    setLenisInstance(lenis)

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    // Intercept internal anchor link clicks for buttery-smooth Lenis glides
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (href && href.startsWith('#') && href.length > 1) {
        const targetElement = document.querySelector(href) as HTMLElement | null
        if (targetElement) {
          e.preventDefault()
          lenis.scrollTo(targetElement, { offset: 0, duration: 1.2 })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    // Initial refresh
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 400)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
    }
  }, [pathname])

  // Auto-refresh ScrollTrigger whenever route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)
    return () => clearTimeout(timer)
  }, [pathname])

  const scrollTo = (target: string | HTMLElement, options?: Record<string, unknown>) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, options)
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'string') {
        const el = document.querySelector(target)
        el?.scrollIntoView({ behavior: 'smooth' })
      } else if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
