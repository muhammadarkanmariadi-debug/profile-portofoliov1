'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Award, Calendar, ExternalLink, ShieldCheck } from 'lucide-react'
import type { Achievement } from '@prisma/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { getOptimizedImageUrl } from '@/lib/utils/image'

gsap.registerPlugin(ScrollTrigger)

interface AchievementDetailClientProps {
  achievement: Achievement
  nextAchievement?: Achievement | null
}

export default function AchievementDetailClient({
  achievement,
  nextAchievement,
}: AchievementDetailClientProps) {
  const containerRef = useRef<HTMLElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)
  const navBarRef = useRef<HTMLDivElement>(null)
  const metaBadgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const docFrameRef = useRef<HTMLDivElement>(null)
  const docInnerRef = useRef<HTMLDivElement>(null)
  const gridMetaRef = useRef<HTMLDivElement>(null)
  const nextStripRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    // 1. Watermark Parallax Scrub
    if (watermarkRef.current) {
      gsap.fromTo(
        watermarkRef.current,
        { yPercent: 0, opacity: 0.02 },
        {
          yPercent: -25,
          opacity: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      )
    }

    // 2. Entrance Sequence
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (navBarRef.current) {
      tl.fromTo(navBarRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
    }

    if (metaBadgeRef.current) {
      tl.fromTo(metaBadgeRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
    }

    if (headingRef.current) {
      tl.fromTo(headingRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.85 }, '-=0.3')
    }

    if (descRef.current) {
      tl.fromTo(descRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.4')
    }

    if (ctaRef.current) {
      tl.fromTo(ctaRef.current, { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.3')
    }

    if (docFrameRef.current) {
      tl.fromTo(
        docFrameRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
        '-=0.3'
      )
    }

    // 3. 3D Document Frame Tilt on Hover (fine pointer only)
    if (docInnerRef.current && typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const el = docInnerRef.current
      const xTo = gsap.quickTo(el, 'rotateY', { duration: 0.35, ease: 'power2.out' })
      const yTo = gsap.quickTo(el, 'rotateX', { duration: 0.35, ease: 'power2.out' })

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        xTo(x / 40)
        yTo(-y / 40)
      }

      const handleMouseLeave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('mousemove', handleMouseMove)
      el.addEventListener('mouseleave', handleMouseLeave)
    }

    // 4. Metadata details reveal on scroll
    if (gridMetaRef.current) {
      gsap.fromTo(
        gridMetaRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridMetaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }

    // 5. Next Strip Entrance
    if (nextStripRef.current) {
      gsap.fromTo(
        nextStripRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: nextStripRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }
  }, { scope: containerRef, dependencies: [achievement.id] })

  return (
    <main
      ref={containerRef}
      className="w-full bg-background text-text-primary pt-28 pb-32 min-h-screen px-6 sm:px-10 relative overflow-hidden select-none border-b border-border transition-colors duration-300"
    >
      {/* Background Watermark */}
      <div
        ref={watermarkRef}
        className="absolute top-24 right-0 font-heading font-black text-[22vw] leading-none text-text-primary opacity-[0.03] pointer-events-none -z-0 will-change-transform"
      >
        AWARD
      </div>

      <div className="max-w-[1350px] mx-auto relative z-10">
        {/* Top Back Navigation Bar */}
        <div
          ref={navBarRef}
          className="flex items-center justify-between border-b border-border pb-6 mb-12 font-mono text-xs uppercase tracking-[0.2em] text-text-muted"
        >
          <Link
            href="/achievements"
            className="flex items-center gap-2 hover:text-primary transition-colors cursor-target font-bold"
          >
            <ArrowLeft size={14} />
            <span>BACK TO CREDENTIALS</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="font-bold text-primary">04</span>
            <span>VERIFIED RECORD</span>
          </div>
        </div>

        {/* Credential Header */}
        <header className="mb-14 space-y-6">
          <div ref={metaBadgeRef} className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-text-muted">
            <span className="px-3 py-1 rounded-full bg-primary text-background font-bold text-[10px] flex items-center gap-1.5">
              <Award size={13} />
              <span>{achievement.status}</span>
            </span>
            <span>·</span>
            <span>{new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>

          <div className="overflow-hidden">
            <h1
              ref={headingRef}
              className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] tracking-tighter text-text-primary leading-[0.95] max-w-5xl will-change-transform"
            >
              {achievement.title}
            </h1>
          </div>

          <p ref={descRef} className="text-lg sm:text-xl text-text-muted font-sans max-w-3xl leading-relaxed">
            {achievement.description}
          </p>

          {/* Direct Document Action */}
          {achievement.imageUrl && (
            <div ref={ctaRef} className="pt-4">
              <a
                href={achievement.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-primary text-background hover:opacity-90 font-mono text-xs uppercase tracking-widest font-bold transition-all inline-flex items-center gap-2 cursor-target shadow-lg"
              >
                <span>OPEN FULL RESOLUTION DOCUMENT</span>
                <ExternalLink size={15} />
              </a>
            </div>
          )}
        </header>

        {/* Document Showcase Container */}
        {achievement.imageUrl && (
          <div
            ref={docFrameRef}
            className="w-full rounded-3xl p-6 sm:p-10 bg-surface border border-border shadow-xl mb-16 overflow-hidden"
          >
            <div
              ref={docInnerRef}
              className="w-full rounded-2xl overflow-hidden bg-surface-elevated border border-white/10 shadow-2xl flex items-center justify-center p-4 sm:p-8 transform-gpu will-change-transform"
            >
              <img
                src={getOptimizedImageUrl(achievement.imageUrl)}
                alt={achievement.title}
                className="w-full max-h-[75vh] object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        )}

        {/* Credential Details Grid */}
        <div ref={gridMetaRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-border pt-14 mb-20">
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-2 flex items-center gap-2 font-bold">
                <ShieldCheck size={14} className="text-primary" />
                <span>VERIFICATION STATUS</span>
              </h3>
              <p className="text-base font-bold text-text-primary">
                Authenticated Record
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-2 flex items-center gap-2 font-bold">
                <Calendar size={14} className="text-primary" />
                <span>CONFERENCE / ISSUE DATE</span>
              </h3>
              <p className="text-base font-mono text-text-primary">
                {new Date(achievement.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted font-bold">
              ACHIEVEMENT CONTEXT & SUMMARY
            </h3>
            <p className="text-base sm:text-lg text-text-muted font-sans leading-relaxed">
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Next Achievement Footer Strip */}
        {nextAchievement && (
          <div
            ref={nextStripRef}
            className="border-t border-border pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-wider"
          >
            <span className="text-text-muted">CONTINUE BROWSING</span>
            <Link
              href={`/achievements/${nextAchievement.slug || nextAchievement.id}`}
              className="flex items-center gap-3 text-lg sm:text-2xl font-heading font-black text-text-primary hover:text-primary transition-colors cursor-target group"
            >
              <span>NEXT: {nextAchievement.title}</span>
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
