'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLanguage } from '../providers'
import type { Profile } from '@prisma/client'
import ThemeToggle from '@/components/ui/ThemeToggle'

gsap.registerPlugin(ScrollTrigger)

const ChromeTorus = dynamic(() => import('@/components/ChromeTorus'), { 
  ssr: false,
  loading: () => <div className="w-full h-full" />
})

interface HeroProps {
  profile?: Profile | null;
}

export default function Hero({ profile: _profile }: HeroProps) {
  const { lang } = useLanguage()
  const sectionRef = React.useRef<HTMLElement>(null)
  const centerRef = React.useRef<HTMLDivElement>(null)
  const row1Ref = React.useRef<HTMLSpanElement>(null)
  const row2Ref = React.useRef<HTMLSpanElement>(null)
  const row3Ref = React.useRef<HTMLSpanElement>(null)
  const hairlineRef = React.useRef<HTMLDivElement>(null)
  const headerRef = React.useRef<HTMLElement>(null)
  const footerRef = React.useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    const mm = gsap.matchMedia(sectionRef)

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      const { isDesktop, reduceMotion } = context.conditions as { isDesktop: boolean; isMobile: boolean; reduceMotion: boolean }

      if (reduceMotion) {
        gsap.set([row1Ref.current, row2Ref.current, row3Ref.current, hairlineRef.current, headerRef.current, footerRef.current], {
          opacity: 1,
          y: 0,
          scaleX: 1
        })
        return
      }

      // Entrance Animation Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      tl.fromTo([row1Ref.current, row2Ref.current, row3Ref.current], 
        { y: isDesktop ? 60 : 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power3.out' }
      )
      .fromTo(hairlineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.7, duration: 1, ease: 'expo.out' },
        '-=0.6'
      )
      .fromTo([headerRef.current, footerRef.current],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        '-=0.5'
      )

      // Scroll-driven Parallax Scrub with explicit fromTo & immediateRender: false
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.0,
          invalidateOnRefresh: true,
        }
      })

      scrollTl
        .fromTo(row1Ref.current, { xPercent: 0, opacity: 1 }, { xPercent: isDesktop ? -8 : -3, opacity: 0.35, ease: 'none', immediateRender: false }, 0)
        .fromTo(row2Ref.current, { xPercent: 0, opacity: 1 }, { xPercent: isDesktop ? 8 : 3, opacity: 0.35, ease: 'none', immediateRender: false }, 0)
        .fromTo(row3Ref.current, { yPercent: 0, scale: 1, opacity: 1 }, { yPercent: isDesktop ? 20 : 10, scale: 0.94, opacity: 0.2, ease: 'none', immediateRender: false }, 0)
        .fromTo(hairlineRef.current, { scaleX: 1, opacity: 0.7 }, { scaleX: 1.15, opacity: 0.2, ease: 'none', immediateRender: false }, 0)
        .fromTo([headerRef.current, footerRef.current], { opacity: 1, y: 0 }, { opacity: 0, y: -20, ease: 'none', immediateRender: false }, 0)
    })

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section 
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-background text-text-primary flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden border-b border-border transition-colors duration-300"
    >
      {/* Top Navigation & Meta Bar */}
      <header ref={headerRef} className="w-full flex items-center justify-between z-30 font-mono text-xs uppercase tracking-[0.2em]">
        <Link href="#home" className="font-bold flex items-center gap-2 group cursor-target text-text-primary">
          <span className="w-7 h-7 rounded border border-border flex items-center justify-center text-[10px] font-black group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-all">
            4R
          </span>
          <span className="hidden sm:inline font-extrabold tracking-wider group-hover:text-primary transition-colors">4RK4N.DEV</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <nav className="flex items-center gap-3 sm:gap-7 md:gap-9 text-text-muted text-[11px] sm:text-xs">
            <Link href="#work" className="hover:text-text-primary hover:text-primary transition-colors cursor-target font-medium">
              WORK
            </Link>
            <Link href="#about" className="hover:text-text-primary hover:text-primary transition-colors cursor-target font-medium">
              ABOUT
            </Link>
            <Link href="#skills" className="hover:text-text-primary hover:text-primary transition-colors cursor-target font-medium">
              SKILLS
            </Link>
            <Link href="#achievements" className="hidden sm:inline-block hover:text-text-primary hover:text-primary transition-colors cursor-target font-medium">
              CREDENTIALS
            </Link>
            <Link href="#contact" className="hover:text-text-primary hover:text-primary transition-colors cursor-target font-medium">
              CONTACT
            </Link>
          </nav>

          <ThemeToggle showLabel={false} />
        </div>
      </header>

      {/* Centerpiece: Huge Typography + 3D Chrome Torus + Hairline Ticks */}
      <div 
        ref={centerRef}
        className="relative w-full flex-grow flex items-center justify-center my-auto py-8 transform-gpu"
      >
        
        {/* Horizontal Hairline & Ticks */}
        <div ref={hairlineRef} className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex items-center justify-between pointer-events-none z-0 px-4 opacity-70 origin-center">
          <div className="w-1/4 h-[1px] bg-border"></div>
          <div className="flex gap-2 text-text-muted font-mono text-[9px]">
            <span>+</span>
            <span>-</span>
            <span>+</span>
          </div>
          <div className="w-1/3 h-[1px] bg-border"></div>
          <div className="flex gap-2 text-text-muted font-mono text-[9px]">
            <span>+</span>
            <span>-</span>
            <span>+</span>
          </div>
          <div className="w-1/4 h-[1px] bg-border"></div>
        </div>

        {/* 3-Row Giant Typography */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center pointer-events-none w-full max-w-[1400px]">
          <h1 className="font-heading font-black tracking-tighter leading-[0.88] text-text-primary uppercase w-full flex flex-col items-center justify-center select-none -skew-y-2 lg:-skew-y-3 transform-gpu">
            <span ref={row1Ref} className="text-[13vw] sm:text-[12vw] lg:text-[15vw] leading-none block will-change-transform">
              JUNIOR
            </span>
            <span ref={row2Ref} className="text-[13vw] sm:text-[12vw] lg:text-[15vw] leading-none block will-change-transform">
              FULLSTACK
            </span>
            <span ref={row3Ref} className="text-[8.2vw] sm:text-[7.2vw] lg:text-[9.2vw] leading-none block will-change-transform">
              DEVELOPER
            </span>
          </h1>
        </div>

        {/* 3D Chrome Torus Knot Layered in the Center — Perfectly Stable & Centered */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-20 flex items-center justify-center overflow-visible">
          <ChromeTorus />
        </div>

      </div>

      {/* Bottom Meta Bar */}
      <footer ref={footerRef} className="w-full flex items-center justify-between z-30 font-mono text-xs uppercase tracking-[0.2em] text-text-muted pt-4">
        <span>4RK4N.DEV</span>
        <Link href="#about" className="flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-target font-semibold">
          <span>SCROLL TO EXPLORE</span>
          <span>↓</span>
        </Link>
      </footer>
    </section>
  )
}
