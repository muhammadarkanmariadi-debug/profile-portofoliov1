'use client'
import React, { useState, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  Github,
  Linkedin,
  FileText,
  Globe,
  Clock,
  Sparkles
} from 'lucide-react'
import { useSmoothScroll } from '../providers/SmoothScrollProvider'
import type { Profile } from '@prisma/client'

gsap.registerPlugin(ScrollTrigger)

interface ContactCTAProps {
  profile?: Profile | null;
}

export default function ContactCTA({ profile }: ContactCTAProps) {
  const [copied, setCopied] = useState(false)
  const { scrollTo } = useSmoothScroll()
  const sectionRef = useRef<HTMLElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const line1Ref = useRef<HTMLHeadingElement>(null)
  const line2Ref = useRef<HTMLHeadingElement>(null)
  const qMarkRef = useRef<HTMLSpanElement>(null)
  const editorialRef = useRef<HTMLDivElement>(null)
  const emailBarRef = useRef<HTMLDivElement>(null)
  const emailSubRef = useRef<HTMLDivElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  const email = profile?.email || 'muhammadarkanmariadi@gmail.com'
  const github = profile?.githubUrl || 'https://github.com/MuhammadArkanMariadi'
  const linkedin = profile?.linkedinUrl || 'https://linkedin.com/in/muhammadarkanmariadi'

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email)
      setCopied(true)

      // Pulse animation on the check circle
      if (emailBarRef.current) {
        gsap.fromTo(
          emailBarRef.current,
          { scale: 0.98 },
          { scale: 1, duration: 0.4, ease: 'back.out(2)' }
        )
      }

      setTimeout(() => setCopied(false), 2500)
    }
  }

  useGSAP((context, contextSafe) => {
    if (!sectionRef.current) return

    const mm = gsap.matchMedia(sectionRef)

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions as {
          isDesktop: boolean
          isMobile: boolean
          reduceMotion: boolean
        }

        if (reduceMotion) {
          gsap.set(
            [
              watermarkRef.current,
              headerRef.current,
              line1Ref.current,
              line2Ref.current,
              qMarkRef.current,
              editorialRef.current,
              emailBarRef.current,
              emailSubRef.current,
              footerRef.current,
              ...(socialsRef.current ? socialsRef.current.querySelectorAll('.social-pill-btn') : []),
            ],
            { opacity: 1, y: 0, yPercent: 0, scale: 1, rotate: 0 }
          )
          return
        }

        // 1. Watermark dynamic parallax scrub
        if (watermarkRef.current) {
          gsap.fromTo(
            watermarkRef.current,
            { yPercent: 20, opacity: 0.03 },
            {
              yPercent: -20,
              opacity: 0.08,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        }

        // 2. Choreographed Grand Entrance & Reverse Timeline
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        })

        // Header Meta Bar
        if (headerRef.current) {
          mainTl.fromTo(
            headerRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
          )
        }

        // Split Headline Lines Masked Reveal
        if (line1Ref.current && line2Ref.current) {
          mainTl.fromTo(
            [line1Ref.current, line2Ref.current],
            { yPercent: 110 },
            { yPercent: 0, duration: 0.85, stagger: 0.1, ease: 'power4.out' },
            '-=0.4'
          )
        }

        // Elastic Bounce on Question Mark "?"
        if (qMarkRef.current) {
          mainTl.fromTo(
            qMarkRef.current,
            { scale: 0, y: -35, rotate: -25, opacity: 0 },
            { scale: 1, y: 0, rotate: 0, opacity: 1, duration: 0.95, ease: 'back.out(2.4)' },
            '-=0.5'
          )
        }

        // Editorial Narrative & Timezone Badges
        if (editorialRef.current) {
          mainTl.fromTo(
            editorialRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
            '-=0.5'
          )
        }

        // Magnetic Email Pill Entrance
        if (emailBarRef.current) {
          mainTl.fromTo(
            emailBarRef.current,
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
            '-=0.45'
          )
        }

        // Email helper sub-bar
        if (emailSubRef.current) {
          mainTl.fromTo(
            emailSubRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
            '-=0.4'
          )
        }

        // Quick Social Channel Pills Stagger Pop-in
        if (socialsRef.current) {
          const buttons = socialsRef.current.querySelectorAll('.social-pill-btn')
          mainTl.fromTo(
            buttons,
            { opacity: 0, y: 25, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.65, ease: 'back.out(1.8)' },
            '-=0.4'
          )
        }

        // Bottom Footer Meta Bar
        if (footerRef.current) {
          mainTl.fromTo(
            footerRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.35'
          )
        }
      }
    )

    // 3. Fast, Snappy Magnetic Physics on Dark Email Pill & Copy Button (Desktop fine pointer only)
    const el = emailBarRef.current
    if (el && typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power2.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power2.out' })

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = (e.clientX - centerX) * 0.22
        const deltaY = (e.clientY - centerY) * 0.35
        xTo(deltaX)
        yTo(deltaY)
      }

      const handleMouseLeave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('mousemove', handleMouseMove, { passive: true })
      el.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        el.removeEventListener('mousemove', handleMouseMove)
        el.removeEventListener('mouseleave', handleMouseLeave)
        mm.revert()
      }
    }

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-20 w-full min-h-screen bg-background text-text-primary flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden border-t border-border transition-colors duration-300"
    >
      {/* Background Watermark 06 with Parallax Glow */}
      <div
        ref={watermarkRef}
        className="absolute right-0 bottom-10 font-heading font-black text-[28vw] leading-none text-text-primary pointer-events-none z-0 select-none will-change-transform"
      >
        06
      </div>

      {/* Top Section Header with Index */}
      <header ref={headerRef} className="w-full flex items-center justify-between border-b border-border pb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted z-10">
        <div className="flex items-center gap-4">
          <span className="font-bold text-primary">06</span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span>AVAILABLE FOR WORK</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 sm:gap-6 md:gap-8 text-[11px] sm:text-xs font-bold text-text-muted">
          <Link href="#work" className="hover:text-text-primary transition-colors cursor-target">WORK</Link>
          <Link href="#about" className="hover:text-text-primary transition-colors cursor-target">ABOUT</Link>
          <Link href="#skills" className="hover:text-text-primary transition-colors cursor-target">SKILLS</Link>
          <Link href="#approach" className="hover:text-text-primary transition-colors cursor-target">APPROACH</Link>
          <Link href="#achievements" className="hidden md:inline-block hover:text-text-primary transition-colors cursor-target">CREDENTIALS</Link>
          <Link href="#contact" className="hover:text-text-primary font-black text-text-primary border-b border-primary pb-0.5 transition-colors cursor-target">CONTACT</Link>
        </div>
      </header>

      {/* Center Body: Massive Extrabold WANT TO CONNECT Heading + Interactive Hub */}
      <div className="w-full max-w-[1400px] mx-auto my-auto py-10 sm:py-16 md:py-20 z-10">

        {/* Massive Extrabold Heading with Masked Overflow */}
        <div className="mb-6 sm:mb-10 md:mb-12">
          <div className="overflow-hidden">
            <h2
              ref={line1Ref}
              className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[8vw] tracking-tighter leading-[0.88] uppercase text-text-primary select-none will-change-transform"
            >
              WANT TO
            </h2>
          </div>
          <div className="overflow-hidden mt-1 sm:mt-2">
            <h2
              ref={line2Ref}
              className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[8vw] tracking-tighter leading-[0.88] uppercase text-text-primary inline-flex items-center select-none will-change-transform"
            >
              <span>CONNECT</span>
              <span
                ref={qMarkRef}
                className="text-transparent text-text-primary ml-2 sm:ml-4 inline-block will-change-transform"
                style={{ WebkitTextStroke: '2.8px currentColor' }}
              >
                ?
              </span>
            </h2>
          </div>
        </div>

        {/* Editorial Sub-statement & Metadata Grid */}
        <div ref={editorialRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-8 sm:mb-10 items-end border-t border-border pt-6 sm:pt-8">
          <div className="lg:col-span-7">
            <p className="font-heading font-bold text-xl sm:text-3xl md:text-4xl text-text-primary tracking-tight leading-snug">
              Let&#39;s make something impossible to ignore.
            </p>
            <p className="font-sans text-xs sm:text-sm md:text-base text-text-muted leading-relaxed mt-2 sm:mt-2.5 max-w-xl font-medium">
              Open for full-stack engineering roles, high-concurrency systems development, and digital architecture consultations.
            </p>
          </div>

          {/* Quick Location / Timezone Chips */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2.5 sm:gap-3 font-mono text-xs uppercase">
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-surface border border-border flex flex-col justify-between shadow-xs">
              <span className="text-text-muted flex items-center gap-1 text-[10px] sm:text-[11px] font-bold">
                <Globe size={13} className="text-primary" />
                <span>LOCATION</span>
              </span>
              <span className="font-bold text-text-primary mt-1 text-xs sm:text-sm">MALANG, ID</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-surface border border-border flex flex-col justify-between shadow-xs">
              <span className="text-text-muted flex items-center gap-1 text-[10px] sm:text-[11px] font-bold">
                <Clock size={13} className="text-primary" />
                <span>TIMEZONE</span>
              </span>
              <span className="font-bold text-text-primary mt-1 text-xs sm:text-sm">WIB (UTC+7)</span>
            </div>
          </div>
        </div>

        {/* Full-width Email Bar with Snappy Magnetic Physics & Glowing Feedback */}
        <div className="w-full">
          <div
            ref={emailBarRef}
            onClick={handleCopyEmail}
            className={`w-full bg-surface hover:bg-surface-elevated text-text-primary rounded-2xl sm:rounded-full p-4 sm:p-5 pl-5 sm:pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 shadow-xl hover:shadow-2xl transition-[background-color,border-color,box-shadow] duration-200 group cursor-target border ${
              copied ? 'border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]' : 'border-border hover:border-primary/40'
            } transform-gpu will-change-transform select-none`}
          >
            <div className="flex flex-col truncate pr-2 sm:pr-4">
              <span className="font-mono text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] text-text-muted font-bold flex items-center gap-1.5">
                {copied ? (
                  <>
                    <Sparkles size={13} className="text-emerald-500 animate-spin" />
                    <span className="text-emerald-500">COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  'CLICK BAR TO COPY DIRECT EMAIL'
                )}
              </span>
              <span className="font-heading font-extrabold text-base sm:text-2xl md:text-3xl lg:text-4xl text-text-primary tracking-tight truncate group-hover:text-primary transition-colors mt-1">
                {email}
              </span>
            </div>

            {/* Right Action Circle */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className="hidden md:inline-flex items-center font-mono text-xs uppercase tracking-wider text-text-muted group-hover:text-text-primary transition-colors font-bold">
                {copied ? 'COPIED' : 'COPY'}
              </span>
              <div className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all shadow-md ${
                copied
                  ? 'bg-emerald-500 text-black'
                  : 'bg-primary text-background group-hover:opacity-90'
              }`}>
                {copied ? <Check size={20} className="stroke-[3]" /> : <Copy size={18} />}
              </div>
            </div>
          </div>

          <div ref={emailSubRef} className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-text-muted mt-2.5 sm:mt-3 px-2 sm:px-4 font-bold will-change-transform">
            <span>COPY EMAIL ADDRESS</span>
            <a href={`mailto:${email}`} className="underline hover:text-text-primary transition-colors cursor-target">
              OPEN EMAIL CLIENT ↗
            </a>
          </div>
        </div>

        {/* Quick Social & Inquiry Channels with Staggered Entrance */}
        <div ref={socialsRef} className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <a
            href={`mailto:${email}`}
            className="social-pill-btn p-3.5 sm:p-4 rounded-2xl bg-surface border border-border text-text-primary hover:bg-surface-elevated hover:border-primary/50 hover:text-primary transition-all flex items-center justify-between group cursor-target shadow-xs hover:-translate-y-1 duration-200 will-change-transform"
          >
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-text-muted group-hover:text-primary transition-colors" />
              <span className="font-heading font-bold text-xs sm:text-sm">Email</span>
            </div>
            <ArrowUpRight size={14} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </a>

          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn p-3.5 sm:p-4 rounded-2xl bg-surface border border-border text-text-primary hover:bg-surface-elevated hover:border-primary/50 hover:text-primary transition-all flex items-center justify-between group cursor-target shadow-xs hover:-translate-y-1 duration-200 will-change-transform"
          >
            <div className="flex items-center gap-2.5">
              <Github size={16} className="text-text-muted group-hover:text-primary transition-colors" />
              <span className="font-heading font-bold text-xs sm:text-sm">GitHub</span>
            </div>
            <ArrowUpRight size={14} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </a>

          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn p-3.5 sm:p-4 rounded-2xl bg-surface border border-border text-text-primary hover:bg-surface-elevated hover:border-primary/50 hover:text-primary transition-all flex items-center justify-between group cursor-target shadow-xs hover:-translate-y-1 duration-200 will-change-transform"
          >
            <div className="flex items-center gap-2.5">
              <Linkedin size={16} className="text-text-muted group-hover:text-primary transition-colors" />
              <span className="font-heading font-bold text-xs sm:text-sm">LinkedIn</span>
            </div>
            <ArrowUpRight size={14} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </a>

          <Link
            href="/contact"
            className="social-pill-btn p-3.5 sm:p-4 rounded-2xl bg-surface border border-border text-text-primary hover:bg-surface-elevated hover:border-primary/50 hover:text-primary transition-all flex items-center justify-between group cursor-target shadow-xs hover:-translate-y-1 duration-200 will-change-transform"
          >
            <div className="flex items-center gap-2.5">
              <FileText size={16} className="text-text-muted group-hover:text-primary transition-colors" />
              <span className="font-heading font-bold text-xs sm:text-sm">Send Inquiry</span>
            </div>
            <ArrowUpRight size={14} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </Link>
        </div>

      </div>

      {/* Bottom Footer Line */}
      <footer ref={footerRef} className="w-full flex items-center justify-between border-t border-border pt-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted z-10 will-change-transform">
        <span>4RK4N.DEV</span>
        <span className="hidden sm:inline font-bold">DIGITAL EXPERIENCES</span>
        <button
          onClick={() => scrollTo('#home')}
          className="hover:text-text-primary transition-colors cursor-target flex items-center gap-1 font-bold"
        >
          <span>BACK TO TOP</span>
          <span>↑</span>
        </button>
      </footer>
    </section>
  )
}
