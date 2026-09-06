'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Layers, Sparkles, Terminal, Rocket } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export interface StepDetail {
  number: string
  title: string
  tag: string
  subtitle: string
  description: string
  deliverables: string[]
  icon: React.ComponentType<{ className?: string }>
}

export const APPROACH_STEPS: StepDetail[] = [
  {
    number: '01',
    tag: '• SCOPE, SCHEMAS & BLUEPRINT',
    title: 'DISCOVERY & ARCHITECTURE',
    subtitle: 'Database Schemas & API Contracts',
    description:
      'Deconstruct complex product requirements into modular domain architectures. Define PostgreSQL schemas with Prisma ORM, map secure API boundaries, and evaluate system tradeoffs before writing code.',
    deliverables: ['Prisma Schema & Models', 'API Contracts', 'Architecture Topology'],
    icon: Layers,
  },
  {
    number: '02',
    tag: '• FIGMA TO 60FPS COMPONENTS',
    title: 'UI/UX & KINETIC PROTOTYPING',
    subtitle: '60FPS Kinetic Components',
    description:
      'Design responsive layouts with high contrast, fluid typography, and bespoke micro-interactions. Translate wireframes into Tailwind CSS tokens and GSAP hardware-accelerated animations.',
    deliverables: ['Design System Tokens', 'Kinetic GSAP Motion', 'Responsive Layouts'],
    icon: Sparkles,
  },
  {
    number: '03',
    tag: '• APIS & REDIS QUERY CACHE',
    title: 'FULL-STACK IMPLEMENTATION',
    subtitle: 'Next.js, APIs & Redis Cache',
    description:
      'Develop resilient full-stack systems using Next.js App Router, NestJS / Laravel backends, sub-50ms Redis query caching, and strict TypeScript types across all domain boundaries.',
    deliverables: ['Next.js Server Actions', 'REST / GraphQL APIs', 'Redis Query Cache'],
    icon: Terminal,
  },
  {
    number: '04',
    tag: '• DOCKER, VPS & TELEMETRY',
    title: 'TESTING, DEVOPS & SHIP',
    subtitle: 'Docker, AWS Cloud & Telemetry',
    description:
      'Execute automated end-to-end testing, multi-stage Docker containerization, and continuous zero-downtime deployments onto AWS EC2 / Linux VPS with health telemetry.',
    deliverables: ['Multi-Stage Dockerfile', 'AWS / VPS Infrastructure', 'Production Health Checks'],
    icon: Rocket,
  },
]

interface EngineeringApproachSectionProps {
  steps?: StepDetail[]
}

export default function EngineeringApproachSection({
  steps = APPROACH_STEPS,
}: EngineeringApproachSectionProps) {
  const containerRef = useRef<HTMLElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const progressTextRef = useRef<HTMLSpanElement>(null)

  // GSAP ScrollTrigger Soft-Entry Pinning & Sequential Fanning Animation (Option 1)
  useGSAP(() => {
    if (!containerRef.current) return

    const mm = gsap.matchMedia(containerRef)

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isLargeDesktop: '(min-width: 1280px)',
        isMobile: '(max-width: 1023px)',
      },
      (context) => {
        const { isDesktop, isLargeDesktop } = context.conditions as {
          isDesktop: boolean
          isLargeDesktop: boolean
        }
        if (!containerRef.current) return

        const cards = gsap.utils.toArray<HTMLElement>('.fanned-stack-card', containerRef.current)
        if (cards.length === 0) return

        if (isDesktop) {
          // Generous fanning offsets for clear visual separation
          const offsetX = isLargeDesktop ? 80 : 66
          const offsetY = isLargeDesktop ? 16 : 12

          const getTargetX = (i: number) => i * offsetX
          const getTargetY = (i: number) => i * offsetY

          // Set Initial State: Card 0 settled, Cards 1..N poised to enter from right
          gsap.set(cards[0], {
            x: getTargetX(0),
            y: getTargetY(0),
            autoAlpha: 1,
            scale: 1,
          })

          cards.slice(1).forEach((card, idx) => {
            const actualIdx = idx + 1
            gsap.set(card, {
              x: getTargetX(actualIdx) + (isLargeDesktop ? 220 : 180),
              y: getTargetY(actualIdx) + 24,
              autoAlpha: 0,
              scale: 0.94,
            })
          })

          // Pin container with extended scrub distance & anticipated pin
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: () => `+=${cards.length * 800 + 400}`,
              scrub: 1.4,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (progressBarRef.current) {
                  gsap.set(progressBarRef.current, { scaleX: self.progress })
                }
                if (progressTextRef.current) {
                  const currentStage = Math.min(
                    cards.length,
                    Math.floor(self.progress * cards.length) + 1
                  )
                  progressTextRef.current.innerText = `STAGE 0${currentStage} OF 0${cards.length}`
                }
              },
            },
          })

          // PHASE 1: Soft-Entry Lead-In Buffer (Absorbs pin arrival smoothly from Skills)
          if (rightColRef.current && leftColRef.current) {
            tl.fromTo(
              [rightColRef.current, leftColRef.current],
              { y: 25, opacity: 0.82 },
              { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
              0
            )
          }

          // PHASE 2: Sequentially slide in Card 02, Card 03, Card 04 with depth & fanning
          cards.slice(1).forEach((card, idx) => {
            const actualIdx = idx + 1
            const startTime = 1.0 + idx * 1.8

            tl.to(
              card,
              {
                x: getTargetX(actualIdx),
                y: getTargetY(actualIdx),
                autoAlpha: 1,
                scale: 1,
                duration: 1.8,
                ease: 'power2.out',
              },
              startTime
            )
          })

          // PHASE 3: Settle & Reading Buffer before releasing pin smoothly
          tl.to({}, { duration: 1.0 })
        } else {
          // Mobile (< 1024px): Natural vertical stack with individual entrance reveals
          gsap.set(cards, { clearProps: 'all' })

          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { autoAlpha: 0, y: 35 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse',
                },
              }
            )
          })
        }
      }
    )
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="approach"
      className="relative w-full min-h-screen bg-background text-text-primary flex items-center justify-center py-20 lg:py-0 px-5 sm:px-8 md:px-12 lg:px-16 border-b border-border transition-colors duration-300 overflow-hidden select-none"
    >
      {/* Top Atmospheric Gradient Bridge from Skills Section */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-background via-background/60 to-transparent pointer-events-none z-20" />

      {/* Subtle monochrome ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

        {/* LEFT COLUMN: FANNED / CASCADING PINNED CARDS STACK */}
        <div ref={leftColRef} className="lg:col-span-7 xl:col-span-7 flex justify-center lg:justify-start items-center">
          <div className="relative w-full max-w-[620px] h-auto lg:h-[560px] flex flex-col lg:block gap-8 sm:gap-10">
            {steps.map((step, idx) => {
              const StepIcon = step.icon
              const zIndex = idx + 1

              return (
                <div
                  key={step.number}
                  style={{ zIndex }}
                  className="fanned-stack-card lg:absolute lg:top-0 lg:left-0 w-full sm:w-[360px] md:w-[390px] lg:w-[410px] xl:w-[430px] min-h-[460px] sm:min-h-[490px] rounded-3xl bg-white text-[#0D0E11] border border-black/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.35)] p-6 sm:p-8 flex flex-col justify-between transform-gpu"
                >
                  {/* Top Row: Big Number & Circular Icon */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-baseline">
                      <span className="font-heading font-black text-5xl sm:text-6xl text-[#0D0E11] tracking-tighter">
                        {step.number}
                      </span>
                      <span className="font-mono text-xs text-[#7A7F8D] font-bold ml-2">
                        / 04
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-[#0D0E11] bg-black/[0.03]">
                      <StepIcon className="size-4.5" />
                    </div>
                  </div>

                  {/* Middle: Tag, Title & Description */}
                  <div className="flex flex-col gap-2 my-auto py-4">
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-[#7A7F8D] font-bold">
                      {step.tag}
                    </span>
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-[#0D0E11] uppercase tracking-tight leading-tight">
                      {step.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#4A4D57] leading-relaxed mt-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom: Deliverable Chips */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-black/10">
                    {step.deliverables.map((item, dIdx) => (
                      <span
                        key={dIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 bg-black/[0.03] text-[#16181D] font-mono text-[11px] font-medium"
                      >
                        <span className="text-[10px] opacity-60">⊚</span>
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: PROJECT APPROACH HEADLINE, NARRATIVE & PROGRESS */}
        <div ref={rightColRef} className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center gap-6 lg:pl-4">

          {/* Headline Matching Exact Screenshot */}
          <div className="flex flex-col">
            <h2 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5vw] tracking-tighter leading-[0.88] uppercase select-none">
              <span className="block text-text-primary">PROJECT</span>
              <span className="block text-text-muted/40">APPROACH</span>
            </h2>
          </div>

          {/* Subtitle Description */}
          <p className="font-sans text-sm sm:text-base text-text-muted leading-relaxed max-w-md font-normal">
            A structured 4-phase engineering cycle from database schema blueprints to high-throughput full-stack implementation and cloud deployment.
          </p>

          {/* Connected Stages Status & Live Scroll Progress */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-text-muted font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>• 4 CONNECTED STAGES</span>
              </div>
              <span ref={progressTextRef} className="text-text-primary text-[11px]">
                STAGE 01 OF 04
              </span>
            </div>

            {/* Visual Scroll Progress Bar */}
            <div className="w-full h-1 bg-black  bg-white/10 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full w-full dark:bg-white bg-black  origin-left transform-gpu scale-x-0 transition-transform duration-75"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
