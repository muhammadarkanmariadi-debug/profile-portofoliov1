'use client'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Skill } from '@prisma/client'
import { getOptimizedImageUrl } from '@/lib/utils/image'

gsap.registerPlugin(ScrollTrigger)

interface ProjectCardProps {
  id: string
  slug?: string | null
  index?: string
  numericIndex?: number
  totalProjects?: number
  title: string
  description: string
  role?: string | null
  liveUrl?: string | null
  imageUrl: string | null
  category: string
  techStack?: Skill[]
  colorTheme?: string
  onReadMore?: () => void
}

const themeColors = [
  'bg-[#9CC5D8]', // Ice blue
  'bg-[#C4B7E5]', // Soft purple
  'bg-[#8FD3BE]', // Sage mint
  'bg-[#D8B4A6]', // Muted terra
  'bg-[#A3C4BC]'  // Cool teal
]

export default function ProjectCard({
  id,
  slug,
  index = '01',
  numericIndex = 0,
  totalProjects = 3,
  title,
  description,
  liveUrl,
  imageUrl,
  techStack,
  colorTheme,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const innerCardRef = useRef<HTMLDivElement>(null)
  const dimOverlayRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const displayDomain = liveUrl ? liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : '4rkan.dev/project'
  const bgClass = colorTheme || themeColors[parseInt(index, 10) % themeColors.length] || 'bg-[#9CC5D8]'
  const projectHref = `/projects/${slug || id}`

  useGSAP(() => {
    if (!cardRef.current) return

    // 1. Entrance reveal
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    // 2. Parallax internal image glide inside the desktop browser mockup
    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        { yPercent: -8, scale: 1.05 },
        {
          yPercent: 8,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      )
    }

    // 3. Hardware-accelerated sticky stacking scale & dim effect as next card overlaps
    if (numericIndex < totalProjects - 1 && innerCardRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top top+=70',
          end: 'bottom top+=70',
          scrub: true
        }
      })

      tl.to(innerCardRef.current, {
        scale: 0.94 - numericIndex * 0.015,
        yPercent: -2,
        transformOrigin: 'top center',
        ease: 'none'
      }, 0)

      if (dimOverlayRef.current) {
        tl.to(dimOverlayRef.current, {
          opacity: 0.45,
          ease: 'none'
        }, 0)
      }
    }

    // 4. Interactive 3D Card Hover Tilt (fine pointer only)
    if (innerCardRef.current && typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const el = innerCardRef.current
      const xTo = gsap.quickTo(el, "rotateY", { duration: 0.35, ease: "power2.out" })
      const yTo = gsap.quickTo(el, "rotateX", { duration: 0.35, ease: "power2.out" })

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        xTo(x / 35)
        yTo(-y / 35)
      }

      const handleMouseLeave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('mousemove', handleMouseMove)
      el.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        el.removeEventListener('mousemove', handleMouseMove)
        el.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

  }, { scope: cardRef })

  const stickyTop = `calc(4.5rem + ${numericIndex * 24}px)`

  return (
    <article 
      ref={cardRef}
      style={{ top: stickyTop, zIndex: numericIndex + 1 }}
      className="sticky w-full bg-background text-text-primary pt-8 pb-12 border-t border-border/80 will-change-transform"
    >
      <div 
        ref={innerCardRef} 
        className="w-full origin-top will-change-transform transform-gpu"
      >
        {/* Topline: Index + Domain */}
        <div className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-6 px-2">
          <span className="font-bold text-primary">{index}</span>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-target font-bold"
            >
              <span>{displayDomain}</span>
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>

        {/* Heading: Big Title (Left) + Summary (Right) */}
        <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 px-1 sm:px-2">
          <Link href={projectHref} className="group/title">
            <div className="overflow-hidden">
              <h3 
                ref={titleRef}
                className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-text-primary group-hover/title:text-primary transition-colors"
              >
                {title}
              </h3>
            </div>
          </Link>
          <p className="max-w-md text-text-muted text-xs sm:text-sm md:text-base font-sans leading-relaxed">
            {description}
          </p>
        </div>

        {/* Desktop Browser Mockup in Colored Frame */}
        <div className="w-full relative">
          <Link
            href={projectHref}
            className={`block w-full ${bgClass} rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-10 lg:p-12 cursor-target group relative overflow-hidden transform-gpu shadow-xl hover:shadow-2xl transition-[box-shadow] duration-500`}
          >
            {/* Desktop Browser Window */}
            <div className="w-full bg-[#16181D] rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-white/10">

              {/* Browser Bar */}
              <div className="w-full bg-[#111216] px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-white/10">
                {/* 3 Window Control Dots */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#FF5F56]"></span>
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#FFBD2E]"></span>
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#27C93F]"></span>
                </div>

                {/* Address Bar */}
                <div className="px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#1C1F26] border border-white/10 text-[10px] sm:text-[11px] font-mono text-[#8E8E9F] max-w-[150px] sm:max-w-[240px] truncate text-center">
                  {displayDomain}
                </div>

                <div className="w-6 sm:w-8"></div>
              </div>

              {/* Desktop Screenshot Preview with Parallax */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0D0E11]">
                <img
                  ref={imageRef}
                  src={getOptimizedImageUrl(imageUrl) || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
                  alt={`${title} desktop browser screenshot`}
                  className="w-full h-full object-cover object-top will-change-transform transform-gpu origin-center"
                  loading="lazy"
                />

                {/* Floating Action Button on Hover */}
                <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#0D0E11]/90 text-white font-mono text-[10px] sm:text-xs uppercase tracking-wider font-bold backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-105 transition-transform">
                    <span>View case study</span>
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>

            </div>

            {/* Ambient Dark Dim Overlay on Stacking */}
            <div
              ref={dimOverlayRef}
              className="pointer-events-none absolute inset-0 bg-black/60 rounded-2xl sm:rounded-3xl opacity-0 will-change-[opacity]"
            />
          </Link>
        </div>

        {/* Scope Deliverables Footer */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mt-5 sm:mt-6 pt-3 sm:pt-4 font-mono text-xs px-1 sm:px-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-text-muted text-[11px] sm:text-xs">
            <span className="uppercase text-text-primary font-bold">Scope:</span>
            {techStack && techStack.length > 0 ? (
              <span>{techStack.map(s => s.title).join(' · ')}</span>
            ) : (
              <span>Web Architecture · Full-Stack · Real-time API · Cloud Infrastructure</span>
            )}
          </div>

          <Link
            href={projectHref}
            className="text-text-muted hover:text-primary transition-colors uppercase flex items-center gap-1 font-bold cursor-target text-[11px] sm:text-xs"
          >
            <span>EXPLORE ARCHITECTURE</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  )
}