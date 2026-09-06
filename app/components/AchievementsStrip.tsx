'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Award, Sparkles } from 'lucide-react'
import { useLanguage } from '../providers'
import type { Achievement } from '@prisma/client'

gsap.registerPlugin(ScrollTrigger)

interface AchievementsStripProps {
  achievements: Achievement[];
}

export default function AchievementsStrip({ achievements }: AchievementsStripProps) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const headerMetaRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Master Entrance & Exit Timeline (Bidirectional on scroll down / up)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    })

    // 1. Header Index & Verified Badge
    if (headerMetaRef.current) {
      tl.fromTo(
        headerMetaRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
    }

    // 2. Massive Heading Masked Slide-Up
    if (headingRef.current) {
      tl.fromTo(
        headingRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )
    }

    // 3. Grid Cards Staggered Reveal
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll<HTMLElement>('.achievement-card')
      tl.fromTo(
        cards,
        {
          opacity: 0,
          y: 45,
          scale: 0.94,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.09,
          duration: 0.75,
          ease: 'power3.out',
        },
        '-=0.4'
      )

      // Interactive 3D Mouse Tilt on each card
      cards.forEach((card) => {
        const xTo = gsap.quickTo(card, "rotateY", { duration: 0.35, ease: "power2.out" })
        const yTo = gsap.quickTo(card, "rotateX", { duration: 0.35, ease: "power2.out" })

        const onMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          xTo(x / 14)
          yTo(-y / 14)
        }

        const onMouseLeave = () => {
          xTo(0)
          yTo(0)
        }

        card.addEventListener('mousemove', onMouseMove)
        card.addEventListener('mouseleave', onMouseLeave)
      })
    }
  }, { scope: sectionRef, dependencies: [achievements] })

  if (!achievements || achievements.length === 0) return null

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="inverted-theme relative z-10 w-full bg-background text-text-primary py-20 sm:py-24 px-5 sm:px-8 md:px-10 border-b border-border transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Section Header with Index */}
        <header className="w-full border-b border-border pb-8 sm:pb-12 mb-10 sm:mb-16">
          <div ref={headerMetaRef} className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-6 sm:mb-10">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span>VERIFIED RECOGNITION</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bold text-primary">05</span>
              <Link href="/achievements" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors cursor-target font-bold">
                <span>FULL ARCHIVE</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          {/* Big Massive Title with Mask Slide-Up Entry */}
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[7.2vw] tracking-tighter leading-[0.88] uppercase text-text-primary select-none will-change-transform"
            >
              HONORS &<br />
              ACHIEVEMENTS
            </h2>
          </div>
        </header>

        {/* Credentials Grid with Staggered 3D Perspective & Interactive Hover */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 will-change-transform">
          {achievements.slice(0, 6).map((item) => (
            <div
              key={item.id}
              style={{ transformStyle: 'preserve-3d' }}
              className="achievement-card p-5 sm:p-6 rounded-2xl bg-surface border border-border hover:border-primary/60 hover:bg-surface-elevated transition-[border-color,background-color] duration-300 flex flex-col justify-between group cursor-target transform-gpu shadow-sm hover:shadow-xl will-change-transform"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-text-muted mb-4">
                  <span className="flex items-center gap-1.5 text-primary font-bold px-2.5 py-1 rounded-full bg-surface-elevated border border-border group-hover:border-primary/40 transition-colors shadow-xs">
                    <Award size={13} className="text-primary flex-shrink-0" />
                    <span>{item.status}</span>
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-base sm:text-lg text-text-primary group-hover:text-primary transition-colors mb-2 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-text-muted font-sans leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border/80 flex items-center justify-between font-mono text-xs text-text-muted">
                <span className="text-[10px] uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <Sparkles size={11} className="text-primary" />
                  <span>VERIFIED ENTRY</span>
                </span>
                <Link
                  href={`/achievements/${item.slug || item.id}`}
                  className="group-hover:text-primary transition-colors flex items-center gap-1 font-bold text-[11px]"
                >
                  <span>DETAILS</span>
                  <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-muted hover:text-primary transition-colors cursor-target border-b border-border pb-1 font-bold group"
          >
            <span>{t.achievements.viewAll || 'VIEW ALL VERIFIED AWARDS & CERTIFICATES'}</span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}
