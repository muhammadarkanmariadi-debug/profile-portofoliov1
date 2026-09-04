'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Award } from 'lucide-react'
import { useLanguage } from '../providers'
import type { Achievement } from '@prisma/client'

gsap.registerPlugin(ScrollTrigger)

interface AchievementsStripProps {
  achievements: Achievement[];
}

export default function AchievementsStrip({ achievements }: AchievementsStripProps) {
  const { lang, t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Heading reveal
    if (headingRef.current) {
      gsap.fromTo(headingRef.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    // Grid Cards staggered reveal
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.achievement-card')
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Velocity-based subtle dynamic tilt/skew
      const proxy = { skew: 0 }
      const skewSetter = gsap.quickSetter(gridRef.current, "skewY", "deg")
      
      ScrollTrigger.create({
        trigger: sectionRef.current,
        onUpdate: (self) => {
          const rawSkew = self.getVelocity() / -600
          const clampedSkew = Math.max(-4, Math.min(4, rawSkew))
          if (Math.abs(clampedSkew) > Math.abs(proxy.skew)) {
            proxy.skew = clampedSkew
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3",
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew)
            })
          }
        }
      })
    }

  }, { scope: sectionRef, dependencies: [achievements] })

  if (!achievements || achievements.length === 0) return null

  return (
    <section 
      id="achievements" 
      ref={sectionRef}
      className="inverted-theme relative z-10 w-full bg-background text-text-primary py-24 px-6 sm:px-10 border-b border-border transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-[1300px] mx-auto">
        
        {/* Section Header with Index (Matching Concept) */}
        <header className="w-full border-b border-border pb-10 sm:pb-14 mb-14 sm:mb-20">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-8 sm:mb-12">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              <span>VERIFIED RECOGNITION</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bold text-primary">04</span>
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
              className="font-heading font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.2vw] tracking-tighter leading-[0.88] uppercase text-text-primary select-none will-change-transform"
            >
              HONORS &<br />
              ACHIEVEMENTS
            </h2>
          </div>
        </header>

        {/* Credentials Grid with Staggered Entrance & Velocity Skew */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 will-change-transform">
          {achievements.slice(0, 6).map((item) => (
            <div 
              key={item.id}
              className="achievement-card p-6 rounded-2xl bg-surface border border-border hover:border-primary/60 hover:bg-surface-elevated transition-all flex flex-col justify-between group cursor-target transform-gpu shadow-sm hover:shadow-lg hover:-translate-y-1 duration-300"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-text-muted mb-4">
                  <span className="flex items-center gap-1.5 text-primary font-bold">
                    <Award size={14} />
                    <span>{item.status}</span>
                  </span>
                  <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                </div>

                <h4 className="font-heading font-bold text-lg text-text-primary group-hover:text-primary transition-colors mb-2">
                  {item.title}
                </h4>

                <p className="text-sm text-text-muted font-sans leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between font-mono text-xs text-text-muted">
                <span>VERIFIED ENTRY</span>
                <Link href={`/achievements/${item.slug || item.id}`} className="group-hover:text-primary transition-colors flex items-center gap-1 font-bold">
                  <span>DETAILS</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/achievements" 
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-muted hover:text-primary transition-colors cursor-target border-b border-border pb-1"
          >
            <span>{t.achievements.viewAll || 'VIEW ALL VERIFIED AWARDS & CERTIFICATES'}</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  )
}
