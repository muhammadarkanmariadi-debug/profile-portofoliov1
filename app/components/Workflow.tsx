'use client'
import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../providers'
import { ArrowUpRight, Sparkles, Layers, Terminal, Rocket, CheckCircle2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Step {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const STEPS: Step[] = [
  {
    id: 'step-1',
    number: '01',
    title: 'DISCOVERY & ARCHITECTURE',
    subtitle: 'Scope, Database Schema & System Blueprint',
    description: 'Deconstruct complex requirements into modular domain architectures. Define PostgreSQL / Prisma relational schemas, API contracts, and security boundaries before writing code.',
    deliverables: ['Prisma Schema & Migrations', 'API Specification', 'Tech Stack Evaluation'],
    icon: Layers,
    accentColor: '#FF6B8B', // Vibrant Coral Pink from reference
  },
  {
    id: 'step-2',
    number: '02',
    title: 'UI/UX & INTERACTION DESIGN',
    subtitle: 'Figma to 60FPS Kinetic Components',
    description: 'Design responsive layouts with high contrast, fluid typography, and bespoke micro-interactions. Translate wireframes into pixel-perfect Tailwind CSS and GSAP animations.',
    deliverables: ['Figma Prototypes', 'Responsive Layouts', 'Kinetic GSAP / Three.js Motion'],
    icon: Sparkles,
    accentColor: '#FF758F',
  },
  {
    id: 'step-3',
    number: '03',
    title: 'FULL-STACK IMPLEMENTATION',
    subtitle: 'Next.js, APIs & Resilient In-Memory Caching',
    description: 'Develop resilient full-stack systems using Next.js App Router, NestJS / Laravel backends, sub-50ms Redis query caching, and strict TypeScript types.',
    deliverables: ['Next.js Server Actions', 'REST / GraphQL APIs', 'Redis Query Cache Layer'],
    icon: Terminal,
    accentColor: '#FF8FA3',
  },
  {
    id: 'step-4',
    number: '04',
    title: 'TESTING, DEVOPS & SHIP',
    subtitle: 'Docker, Cloud Deployment & Continuous Monitoring',
    description: 'Execute end-to-end testing, multi-stage Docker containerization, and automated deployments onto AWS / Linux VPS with health checks and SSL automation.',
    deliverables: ['Multi-Stage Dockerfile', 'AWS / VPS Infrastructure', 'Production Health Monitoring'],
    icon: Rocket,
    accentColor: '#FFA8BA',
  },
]

export default function Workflow() {
  const { lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const [activeStepIndex, setActiveStepIndex] = useState<number>(3) // Default to step 4 (front card)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Header Slide-Up
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      )
    }

    // GSAP Parallax Deck Stacking & Fanning on scroll
    const cards = gsap.utils.toArray<HTMLElement>('.workflow-fanned-card')
    if (cards.length > 0 && deckRef.current) {
      gsap.fromTo(cards,
        { 
          xPercent: (i) => i * -8,
          yPercent: (i) => i * 4,
          opacity: 0.6,
          scale: (i) => 0.9 + i * 0.025,
        },
        {
          xPercent: 0,
          yPercent: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: deckRef.current,
            start: 'top 75%',
            end: 'bottom 40%',
            scrub: 1.0,
          }
        }
      )
    }
  }, { scope: sectionRef })

  const activeStep = STEPS[activeStepIndex]

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="relative w-full bg-background text-text-primary py-24 sm:py-32 px-6 sm:px-10 border-b border-border transition-colors duration-300 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF5B79]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto">

        {/* Section Index Header */}
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-8 sm:mb-12 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF5B79] animate-pulse" />
            <span>EXECUTION LIFECYCLE</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-bold text-[#FF5B79]">03.5</span>
            <span className="hidden sm:inline-block font-bold">WORKFLOW INDEX</span>
          </div>
        </div>

        {/* Main Grid: Fanned Deck (Left) & Narrative Header (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT SIDE: Cascading / Fanned Card Deck (Screenshot Visual Match) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center">
            <div 
              ref={deckRef}
              className="relative w-full max-w-[580px] h-[400px] sm:h-[480px] md:h-[520px] flex items-center justify-start select-none"
            >
              {STEPS.map((step, idx) => {
                const isActive = activeStepIndex === idx
                // Calculate stacked horizontal offset like in reference image
                const offsetLeft = idx * 60 // 0px, 60px, 120px, 180px
                const zIndex = idx + 1
                const StepIcon = step.icon

                return (
                  <motion.div
                    key={step.id}
                    layout
                    onClick={() => setActiveStepIndex(idx)}
                    onMouseEnter={() => setActiveStepIndex(idx)}
                    whileHover={{ y: -16, scale: 1.03, transition: { duration: 0.25, ease: 'easeOut' } }}
                    style={{
                      left: `${offsetLeft}px`,
                      zIndex: isActive ? 30 : zIndex,
                    }}
                    className={`workflow-fanned-card absolute top-0 w-[240px] sm:w-[280px] md:w-[320px] h-[360px] sm:h-[440px] md:h-[480px] rounded-2xl sm:rounded-3xl border transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between cursor-pointer backdrop-blur-md shadow-2xl ${
                      isActive
                        ? 'bg-surface/95 border-[#FF5B79] shadow-[#FF5B79]/15 ring-2 ring-[#FF5B79]/40'
                        : 'bg-surface/65 border-border/80 hover:border-border hover:bg-surface/85'
                    }`}
                  >
                    {/* Top Bold Number (01, 02, 03, 04 in Coral Pink) */}
                    <div className="flex items-start justify-between">
                      <span 
                        className="font-heading font-black text-6xl sm:text-7xl md:text-8xl tracking-tighter leading-none select-none transition-transform duration-300 group-hover:scale-105"
                        style={{ color: step.accentColor }}
                      >
                        {step.number}
                      </span>

                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                        isActive ? 'bg-[#FF5B79]/20 border-[#FF5B79] text-[#FF5B79]' : 'border-border text-text-muted'
                      }`}>
                        <StepIcon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Bottom Bold Headline */}
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-text-muted">
                        PHASE {step.number}
                      </span>
                      <h3 className="font-heading font-extrabold text-base sm:text-lg md:text-xl uppercase tracking-tight leading-tight text-text-primary">
                        {step.title}
                      </h3>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Mobile Deck Pagination Hint */}
            <div className="flex items-center gap-2 mt-4 font-mono text-[11px] text-text-muted">
              <span>HOVER / TAP CARDS TO EXPAND DETAILS</span>
            </div>
          </div>

          {/* RIGHT SIDE: Narrative Headline & Deep Dive Panel */}
          <div ref={headerRef} className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between gap-8">
            
            {/* Big Massive Headline matching Reference Font */}
            <div className="flex flex-col gap-2">
              <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter leading-[0.9] uppercase text-text-primary">
                ENGINEERING<br />
                <span className="text-text-muted/60">DISCIPLINE</span>
              </h2>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed mt-2">
                Every digital product is engineered through a rigorous, high-velocity 4-phase lifecycle to ensure maximum performance, uptime, and visual fidelity.
              </p>
            </div>

            {/* Active Step Deep-Dive Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="rounded-2xl sm:rounded-3xl border border-border bg-surface/50 p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Accent Top Line */}
                <div 
                  className="absolute top-0 left-0 w-full h-[3px]"
                  style={{ backgroundColor: activeStep.accentColor }}
                />

                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span 
                      className="font-heading font-black text-2xl sm:text-3xl"
                      style={{ color: activeStep.accentColor }}
                    >
                      {activeStep.number}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-base sm:text-lg uppercase text-text-primary">
                        {activeStep.title}
                      </span>
                      <span className="font-mono text-xs text-text-muted">
                        {activeStep.subtitle}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-text-primary/90 text-sm leading-relaxed">
                  {activeStep.description}
                </p>

                {/* Key Deliverables */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted font-bold">
                    CORE DELIVERABLES
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeStep.deliverables.map((del, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-text-primary"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5B79]" />
                        {del}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40 font-mono text-xs text-text-muted">
                  <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStepIndex(i)}
                        className={`w-6 h-1.5 rounded-full transition-all ${
                          activeStepIndex === i ? 'bg-[#FF5B79] w-10' : 'bg-border hover:bg-text-muted'
                        }`}
                        aria-label={`Go to step ${i + 1}`}
                      />
                    ))}
                  </div>

                  <span>STEP {activeStepIndex + 1} OF 4</span>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  )
}
