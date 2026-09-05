'use client'

import React, { useRef } from 'react'
import { useScrollStack } from '@/hooks/useScrollStack'
import { Layers, Sparkles, Terminal, Rocket, CheckCircle2 } from 'lucide-react'

export interface EngineeringStep {
  number: string
  title: string
  subtitle: string
  description: string
  deliverables: string[]
  icon: React.ComponentType<{ className?: string }>
}

export const DEFAULT_ENGINEERING_STEPS: EngineeringStep[] = [
  {
    number: '01',
    title: 'DISCOVERY & ARCHITECTURE',
    subtitle: 'Scope, Schemas & Blueprint',
    description:
      'Deconstruct complex product requirements into modular domain architectures. Define PostgreSQL schemas with Prisma ORM, map API boundaries, and evaluate system tradeoffs.',
    deliverables: ['Prisma Schema & Models', 'API Contracts', 'Architecture Topology'],
    icon: Layers,
  },
  {
    number: '02',
    title: 'UI/UX & KINETIC PROTOTYPING',
    subtitle: 'Figma to 60FPS Components',
    description:
      'Design responsive layouts with high contrast, fluid typography, and bespoke micro-interactions. Translate wireframes into Tailwind CSS tokens and GSAP animations.',
    deliverables: ['Design System Tokens', 'Kinetic GSAP Motion', 'Responsive Layouts'],
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'FULL-STACK IMPLEMENTATION',
    subtitle: 'Next.js, APIs & Redis Cache',
    description:
      'Develop resilient full-stack systems using Next.js App Router, NestJS / Laravel backends, sub-50ms Redis query caching, and strict TypeScript types.',
    deliverables: ['Next.js Server Actions', 'REST / GraphQL APIs', 'Redis Query Cache'],
    icon: Terminal,
  },
  {
    number: '04',
    title: 'TESTING, DEVOPS & SHIP',
    subtitle: 'Docker, AWS Cloud & Telemetry',
    description:
      'Execute automated end-to-end testing, multi-stage Docker containerization, and continuous zero-downtime deployments onto AWS EC2 / Linux VPS with health telemetry.',
    deliverables: ['Multi-Stage Dockerfile', 'AWS / VPS Infrastructure', 'Production Health Checks'],
    icon: Rocket,
  },
]

interface EngineeringApproachSectionProps {
  title?: string
  subtitle?: string
  tag?: string
  steps?: EngineeringStep[]
}

export default function EngineeringApproachSection({
  title = 'PROJECT',
  subtitle = 'APPROACH',
  tag = '',
  steps = DEFAULT_ENGINEERING_STEPS,
}: EngineeringApproachSectionProps) {
  const containerRef = useRef<HTMLElement>(null)

  // Hook GSAP ScrollTrigger fanned stacked cards
  useScrollStack(containerRef)

  return (
    <section
      ref={containerRef}
      id="approach"
      className="relative w-full min-h-screen lg:h-screen lg:max-h-screen bg-background text-text-primary py-16 lg:py-8 xl:py-12 px-5 sm:px-8 md:px-10 border-b border-border transition-colors duration-300 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Ambient background soft glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] w-full h-full mx-auto flex flex-col justify-between gap-8 lg:gap-0">
        
        {/* Section Index Header */}
        <header className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-text-muted border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{tag || 'ENGINEERING METHODOLOGY'}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-bold text-primary">03.5</span>
            <span className="hidden sm:inline-block font-bold">METHODOLOGY INDEX</span>
          </div>
        </header>

        {/* Main Split Grid: Fanned Deck of Self-Contained Cards (Left on Desktop) & Narrative Typography (Right on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 xl:gap-14 items-center flex-grow my-auto w-full">
          
          {/* NARRATIVE TYPOGRAPHY: Top on mobile (order-1), Right on desktop (order-2) */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4 sm:gap-5 justify-center order-1 lg:order-2">
            
            {/* Huge Headline Typography (LENIS BRINGS / THE HEAT style) */}
            <div className="flex flex-col">
              <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[4.2vw] xl:text-[4.6vw] tracking-tighter leading-[0.88] uppercase text-text-primary">
                {title}
              </h2>
              <h3 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[4.2vw] xl:text-[4.6vw] tracking-tighter leading-[0.88] uppercase text-text-muted/30">
                {subtitle}
              </h3>
            </div>

            <p className="font-sans text-sm sm:text-base text-text-muted leading-relaxed max-w-md">
              A structured 4-phase engineering cycle from database schema blueprints to high-throughput full-stack implementation and cloud deployment.
            </p>

            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-muted pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>4 CONNECTED STAGES</span>
            </div>

          </div>

          {/* SELF-CONTAINED CARDS: Bottom on mobile (order-2), Left on desktop (order-1) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center order-2 lg:order-1 w-full">
            <div className="relative w-full max-w-[620px] lg:max-w-[760px] xl:max-w-[820px] 2xl:max-w-[880px] h-auto lg:h-[450px] xl:h-[490px] 2xl:h-[520px] flex flex-col gap-6 lg:block select-none">
              {steps.map((step, idx) => {
                const zIndex = idx + 1
                const StepIcon = step.icon

                return (
                  <div
                    key={step.number}
                    style={{ zIndex }}
                    className="fanned-stack-card w-full h-auto min-h-[380px] sm:min-h-[400px] lg:absolute lg:top-0 lg:left-0 lg:w-[350px] xl:w-[380px] 2xl:w-[410px] lg:h-[430px] xl:h-[470px] 2xl:h-[500px] rounded-2xl sm:rounded-3xl border border-border bg-surface/95 p-6 sm:p-7 xl:p-8 shadow-xl lg:shadow-2xl flex flex-col justify-between backdrop-blur-md transition-colors duration-200 group hover:border-primary/50"
                  >
                    {/* Top Row: Giant Step Number & Icon */}
                    <div className="w-full flex items-start justify-between border-b border-border/60 pb-3 sm:pb-4">
                      <div className="flex items-baseline gap-2.5 sm:gap-3">
                        <span className="font-heading font-black text-5xl sm:text-6xl tracking-tighter text-text-primary leading-none select-none">
                          {step.number}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                          / 04
                        </span>
                      </div>

                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-border bg-surface-elevated text-text-muted group-hover:text-text-primary group-hover:border-primary/40 transition-colors shadow-sm">
                        <StepIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>
                    </div>

                    {/* Middle: Step Subtitle Badge, Title & Short Description */}
                    <div className="flex flex-col gap-2 sm:gap-2.5 my-auto py-2">
                      <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{step.subtitle}</span>
                      </div>

                      <h4 className="font-heading font-black text-lg sm:text-xl xl:text-2xl uppercase tracking-tighter text-text-primary leading-[1.15]">
                        {step.title}
                      </h4>

                      <p className="font-sans text-xs sm:text-[13px] xl:text-sm text-text-muted leading-relaxed line-clamp-4">
                        {step.description}
                      </p>
                    </div>

                    {/* Bottom: Deliverables Tag Pills inside the Card */}
                    <div className="w-full pt-3 border-t border-border/60 flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {step.deliverables.map((item, dIdx) => (
                          <span
                            key={dIdx}
                            className="px-2.5 py-1 rounded-full bg-surface-elevated border border-border text-[10px] sm:text-[11px] font-mono text-text-primary flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Bottom Section Status Meta Bar & Animated Phase Progress Track */}
        <footer className="w-full flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.2em] text-text-muted pt-4 border-t border-border">
          {/* Active Phase Progress Bar Track */}
          <div className="w-full h-1 bg-surface-elevated rounded-full overflow-hidden border border-border/60 relative">
            <div className="approach-progress-bar w-full h-full bg-primary origin-left scale-x-0 will-change-transform" />
          </div>

          <div className="w-full flex items-center justify-between">
            <span>4RK4N.DEV // METHODOLOGY</span>
            <span className="flex items-center gap-2">
              <span className="hidden sm:inline">SCROLL TO ADVANCE PHASE</span>
              <span className="text-primary">↓</span>
            </span>
          </div>
        </footer>

      </div>
    </section>
  )
}
