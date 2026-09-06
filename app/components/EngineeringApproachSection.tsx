'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'
import DisplayCards, { type DisplayCardProps } from '@/components/ui/display-cards'
import { Layers, Sparkles, Terminal, Rocket, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

export interface StepDetail {
  number: string
  title: string
  subtitle: string
  shortDesc: string
  fullDesc: string
  deliverables: string[]
  icon: React.ComponentType<{ className?: string }>
}

export const APPROACH_STEPS: StepDetail[] = [
  {
    number: '01',
    title: 'DISCOVERY & BLUEPRINT',
    subtitle: 'Scope, Schemas & Topology',
    shortDesc: 'Database Schemas & API Contracts',
    fullDesc:
      'Deconstruct complex product requirements into modular domain architectures. Define PostgreSQL schemas with Prisma ORM, map secure API boundaries, and evaluate system tradeoffs before writing code.',
    deliverables: ['Prisma Schema & Migrations', 'API Contracts & Spec', 'Domain Topology'],
    icon: Layers,
  },
  {
    number: '02',
    title: 'KINETIC UI/UX DESIGN',
    subtitle: 'Figma to 60FPS Kinetic Components',
    shortDesc: 'Figma to 60FPS Micro-Interactions',
    fullDesc:
      'Design responsive layouts with high contrast, fluid typography, and bespoke micro-interactions. Translate wireframes into Tailwind CSS tokens and GSAP hardware-accelerated animations.',
    deliverables: ['Design System Tokens', 'Kinetic GSAP Motion', 'Responsive Layouts'],
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'FULL-STACK IMPLEMENTATION',
    subtitle: 'Next.js, APIs & Redis Cache',
    shortDesc: 'Next.js, APIs & Redis Cache',
    fullDesc:
      'Develop resilient full-stack systems using Next.js App Router, NestJS / Laravel backends, sub-50ms Redis query caching, and strict TypeScript types across all boundaries.',
    deliverables: ['Next.js Server Actions', 'REST / GraphQL APIs', 'Redis Query Cache'],
    icon: Terminal,
  },
  {
    number: '04',
    title: 'TESTING, DEVOPS & SHIP',
    subtitle: 'Docker, AWS Cloud & Telemetry',
    shortDesc: 'Multi-Stage Build & Telemetry',
    fullDesc:
      'Execute automated end-to-end testing, multi-stage Docker containerization, and continuous zero-downtime deployments onto AWS EC2 / Linux VPS with health telemetry.',
    deliverables: ['Multi-Stage Dockerfile', 'AWS / VPS Infrastructure', 'Production Health Checks'],
    icon: Rocket,
  },
]

interface EngineeringApproachSectionProps {
  tag?: string
  steps?: StepDetail[]
}

export default function EngineeringApproachSection({
  tag = '',
  steps = APPROACH_STEPS,
}: EngineeringApproachSectionProps) {
  const containerRef = useRef<HTMLElement>(null)
  const headerMetaRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const headerDescRef = useRef<HTMLParagraphElement>(null)
  const cardsWrapperRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState<number>(0)

  // Fluid entrance reveal on scroll (Synchronized with standard portfolio headers)
  useGSAP(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    })

    if (headerMetaRef.current) {
      tl.fromTo(
        headerMetaRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      )
    }

    if (headingRef.current) {
      tl.fromTo(
        headingRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.3'
      )
    }

    if (headerDescRef.current) {
      tl.fromTo(
        headerDescRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
    }

    if (cardsWrapperRef.current) {
      tl.fromTo(
        cardsWrapperRef.current,
        { opacity: 0, scale: 0.94, y: 35 },
        { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.4'
      )
    }

    if (footerRef.current) {
      tl.fromTo(
        footerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )
    }
  }, { scope: containerRef })

  const activeStep = steps[activeIdx] || steps[0]

  // Construct DisplayCards array with sleek monochrome (B&W) tokens & triggers
  const cards: DisplayCardProps[] = steps.map((step, idx) => {
    const StepIcon = step.icon
    return {
      icon: <StepIcon className="size-4 text-white" />,
      title: `${step.number} // ${step.title.split(' ')[0]}`,
      description: step.shortDesc,
      date: `Phase ${step.number} · ${step.subtitle.split(' ')[0]}`,
      iconClassName: 'text-white',
      titleClassName: 'text-white',
      onMouseEnter: () => setActiveIdx(idx),
      onClick: () => setActiveIdx(idx),
      className: cn(
        idx === 0 &&
          "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 cursor-pointer",
        idx === 1 &&
          "[grid-area:stack] translate-x-8 translate-y-8 sm:translate-x-12 sm:translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 cursor-pointer",
        idx === 2 &&
          "[grid-area:stack] translate-x-16 translate-y-16 sm:translate-x-24 sm:translate-y-20 hover:translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 cursor-pointer",
        idx === 3 &&
          '[grid-area:stack] translate-x-24 translate-y-24 sm:translate-x-36 sm:translate-y-30 hover:translate-y-20 cursor-pointer',
        activeIdx === idx && 'grayscale-0 before:opacity-0 ring-2 ring-white/60 shadow-xl shadow-black/80 border-white/40'
      ),
    }
  })

  return (
    <section
      ref={containerRef}
      id="approach"
      className="relative z-10 w-full bg-background text-text-primary py-20 sm:py-24 px-5 sm:px-8 md:px-10 border-b border-border transition-colors duration-300 overflow-hidden select-none"
    >
      {/* Subtle monochrome ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] w-full mx-auto flex flex-col justify-between">
        
        {/* Full Grand Section Header Matching Portfolio Pattern */}
        <header className="w-full border-b border-border pb-8 sm:pb-12 mb-10 sm:mb-16">
          <div ref={headerMetaRef} className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-6 sm:mb-10">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span>{tag || 'ENGINEERING METHODOLOGY'}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bold text-white">4</span>
              <span className="hidden sm:inline-block font-bold">WORKFLOW ARCHITECTURE</span>
            </div>
          </div>

          {/* Big Massive Title with Mask Slide-Up Entry */}
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[7.2vw] tracking-tighter leading-[0.88] uppercase text-text-primary select-none will-change-transform"
            >
              ENGINEERING<br />
              APPROACH
            </h2>
          </div>

          {/* Header Subtitle Statement */}
          <p
            ref={headerDescRef}
            className="mt-4 sm:mt-6 text-sm sm:text-base text-text-muted max-w-2xl font-normal leading-relaxed"
          >
            A disciplined end-to-end framework transforming architectural blueprints into high-performance, resilient digital systems.
          </p>
        </header>

        {/* Main Split Grid: Dynamic Narrative Typography (Left) & DisplayCards Stack (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full">
          
          {/* LEFT: DYNAMIC NARRATIVE CONTENT THAT MORPHS ON CARD HOVER (Desktop & Tablet) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 flex-col justify-center min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.number}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex flex-col gap-5"
              >
                {/* Active Step Badge */}
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-text-muted">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-bold text-[11px] shadow-xs">
                    PHASE {activeStep.number}
                  </span>
                  <span className="truncate text-text-muted">{activeStep.subtitle}</span>
                </div>

                {/* Massive Title */}
                <div className="flex flex-col">
                  <h3 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter leading-[0.94] uppercase text-text-primary">
                    {activeStep.title}
                  </h3>
                </div>

                {/* Full Deep-Dive Description based on hover */}
                <p className="font-sans text-sm sm:text-base text-text-muted leading-relaxed max-w-lg font-normal">
                  {activeStep.fullDesc}
                </p>

                {/* Deliverables Pills */}
                <div className="flex flex-col gap-2.5 pt-2 border-t border-border/60">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted font-bold">
                    PHASE {activeStep.number} DELIVERABLES:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeStep.deliverables.map((item, dIdx) => (
                      <span
                        key={dIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-white/10 font-mono text-xs text-text-primary shadow-xs hover:border-white/30 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Status Hint */}
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-text-muted pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>HOVER OVER CARDS TO SWITCH PHASE</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: EXACT DISPLAY CARDS STACK (Desktop lg+) */}
          <div ref={cardsWrapperRef} className="hidden lg:flex lg:col-span-6 xl:col-span-6 items-center justify-center w-full py-6 sm:py-10">
            <DisplayCards cards={cards} />
          </div>

          {/* MOBILE & SMALL SCREENS (< lg): TOUCH-OPTIMIZED ACCESSIBLE B&W EXPERIENCE */}
          <div className="lg:hidden flex flex-col gap-6 w-full">
            
            {/* Mobile Header Narrative */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>PHASE {activeStep.number} OF 04</span>
              </div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight text-text-primary">
                {activeStep.title}
              </h3>
            </div>

            {/* Mobile Phase Quick-Selector Tabs */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-1 rounded-xl bg-surface border border-border">
              {steps.map((s, idx) => {
                const isActive = activeIdx === idx
                const StepIcon = s.icon
                return (
                  <button
                    key={s.number}
                    onClick={() => setActiveIdx(idx)}
                    className={`py-2 px-1 sm:px-2 rounded-lg font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer select-none ${
                      isActive
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'text-text-muted hover:text-white hover:bg-surface-elevated'
                    }`}
                  >
                    <StepIcon className="size-3.5" />
                    <span className="truncate">{s.number}</span>
                  </button>
                )
              })}
            </div>

            {/* Mobile Featured Display Card (Monochrome B&W, Clear, accessible, full content) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.number}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="w-full rounded-2xl border border-white/15 bg-surface/95 backdrop-blur-md p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-5 relative overflow-hidden"
              >
                {/* Top Row: Icon, Phase Badge & Subtitle */}
                <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
                  <div className="flex items-center gap-3">
                    <span className="relative inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/20 p-2 text-white">
                      <activeStep.icon className="size-4.5" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest font-bold">
                        PHASE {activeStep.number}
                      </span>
                      <span className="font-mono text-xs font-bold text-white uppercase">
                        {activeStep.subtitle}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                    {activeStep.number}/04
                  </span>
                </div>

                {/* Middle: Short & Full Deep-Dive Description */}
                <div className="flex flex-col gap-2.5">
                  <h4 className="font-heading font-bold text-base sm:text-lg text-text-primary">
                    {activeStep.shortDesc}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-text-muted leading-relaxed">
                    {activeStep.fullDesc}
                  </p>
                </div>

                {/* Bottom: Deliverables checklist */}
                <div className="pt-3 border-t border-border/60 flex flex-col gap-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold">
                    CORE DELIVERABLES:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeStep.deliverables.map((d, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-2.5 py-1 rounded-full bg-surface-elevated text-[11px] font-mono text-white border border-white/10 flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="size-3.5 text-white flex-shrink-0" />
                        <span>{d}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mobile Next / Prev Navigation Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-border/40 font-mono text-xs">
                  <button
                    onClick={() => setActiveIdx((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                    className="px-3.5 py-1.5 rounded-lg bg-surface border border-white/15 text-white hover:bg-white hover:text-black flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                  >
                    <span>← PREV</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {steps.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setActiveIdx(dotIdx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeIdx === dotIdx ? 'w-6 bg-white' : 'w-2 bg-white/20'
                        }`}
                        aria-label={`Jump to phase ${dotIdx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveIdx((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                    className="px-3.5 py-1.5 rounded-lg bg-surface border border-white/15 text-white hover:bg-white hover:text-black flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                  >
                    <span>NEXT →</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stepped Mini-Cards List (Quick Touch Switcher for Small Screens) */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted font-bold">
                TAP TO EXPLORE OTHER PHASES:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {steps.map((step, idx) => {
                  const isActive = activeIdx === idx
                  const StepIcon = step.icon
                  return (
                    <button
                      key={step.number}
                      onClick={() => setActiveIdx(idx)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isActive
                          ? 'border-white/40 bg-white/10 shadow-sm'
                          : 'border-white/10 bg-surface/50 hover:bg-surface hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`p-1.5 rounded-lg ${isActive ? 'bg-white text-black' : 'bg-surface-elevated text-text-muted'}`}>
                          <StepIcon className="size-3.5" />
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[10px] text-text-muted font-bold">{step.number} // PHASE</span>
                          <span className="font-heading text-xs font-bold text-text-primary truncate">{step.title}</span>
                        </div>
                      </div>
                      <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-white text-black font-bold' : 'text-text-muted bg-surface border border-white/10'
                      }`}>
                        {isActive ? 'ACTIVE' : 'VIEW'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section Status Meta Bar */}
        <footer ref={footerRef} className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-text-muted pt-8 mt-12 border-t border-border">
          <span>4RK4N.DEV // METHODOLOGY</span>
          <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
            {steps.map((s, i) => (
              <button
                key={s.number}
                onClick={() => setActiveIdx(i)}
                onMouseEnter={() => setActiveIdx(i)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeIdx === i
                    ? 'bg-white/15 text-white border border-white/30 font-bold'
                    : 'hover:text-white'
                }`}
              >
                {s.number}
              </button>
            ))}
          </div>
        </footer>

      </div>
    </section>
  )
}
