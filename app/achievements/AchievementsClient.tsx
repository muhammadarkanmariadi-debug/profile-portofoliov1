'use client'
import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, ChevronDown, Award, X, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/app/providers'
import type { Achievement } from '@prisma/client'
import { getOptimizedImageUrl } from '@/lib/utils/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface AchievementsClientProps {
  initialAchievements: Achievement[]
}

const frameThemes = [
  'bg-[#DCE7EB] border-[#C2D4DC]', // Ice Blue tint
  'bg-[#E5DFEC] border-[#D0C5DB]', // Soft Purple tint
  'bg-[#DBECE6] border-[#C3DDD4]', // Sage Mint tint
  'bg-[#EFE5DC] border-[#DFCFBF]', // Sand Coral tint
]

export default function AchievementsClient({ initialAchievements }: AchievementsClientProps) {
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const containerRef = useRef<HTMLElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)
  const headerMetaRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const headerDescRef = useRef<HTMLParagraphElement>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filteredAchievements = initialAchievements.filter(achievement => {
    const title = achievement.title || ''
    const status = achievement.status || ''

    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      status.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage)

  // Slice for current page
  const currentAchievements = filteredAchievements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 on search
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemsPerPage])

  useGSAP(() => {
    if (!containerRef.current) return

    // 1. Watermark parallax scrub
    if (watermarkRef.current) {
      gsap.fromTo(
        watermarkRef.current,
        { yPercent: 0, opacity: 0.02 },
        {
          yPercent: -20,
          opacity: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          }
        }
      )
    }

    // 2. Header entrance sequence
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (headerMetaRef.current) {
      tl.fromTo(
        headerMetaRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
    }

    if (headingRef.current) {
      tl.fromTo(
        headingRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.85 },
        '-=0.3'
      )
    }

    if (headerDescRef.current) {
      tl.fromTo(
        headerDescRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
    }

    if (searchBarRef.current) {
      tl.fromTo(
        searchBarRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      )
    }
  }, { scope: containerRef })

  // Stagger cards & interactive mouse tilt on page / filter changes
  useGSAP(() => {
    if (!listRef.current) return
    const cards = listRef.current.querySelectorAll<HTMLElement>('.achievement-row-card')
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 35, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.65,
          ease: 'power3.out',
          clearProps: 'transform'
        }
      )

      if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        cards.forEach((card) => {
          const xTo = gsap.quickTo(card, "rotateY", { duration: 0.35, ease: "power2.out" })
          const yTo = gsap.quickTo(card, "rotateX", { duration: 0.35, ease: "power2.out" })

          const onMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            xTo(x / 45)
            yTo(-y / 45)
          }

          const onMouseLeave = () => {
            xTo(0)
            yTo(0)
          }

          card.addEventListener('mousemove', onMouseMove)
          card.addEventListener('mouseleave', onMouseLeave)
        })
      }
    }
  }, { dependencies: [currentPage, searchQuery, itemsPerPage], scope: containerRef })

  return (
    <main
      ref={containerRef}
      className="w-full bg-background text-text-primary pt-28 pb-32 min-h-screen px-6 sm:px-10 relative overflow-hidden select-none border-b border-border transition-colors duration-300"
    >
      {/* Background Watermark 04 */}
      <div
        ref={watermarkRef}
        className="absolute top-20 right-0 font-heading font-black text-[25vw] leading-none text-text-primary opacity-[0.03] pointer-events-none -z-0 will-change-transform"
      >
        04
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Editorial Top Section Header */}
        <header className="mb-16 border-b border-border pb-10">
          {/* Index & Breadcrumb */}
          <div ref={headerMetaRef} className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-text-muted mb-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-primary">04</span>
              <span>CREDENTIALS ARCHIVE</span>
            </div>
            <span>VERIFIED HONORS & AWARDS</span>
          </div>

          {/* Giant Typography */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="overflow-hidden">
              <h1
                ref={headingRef}
                className="font-heading font-black text-5xl sm:text-7xl lg:text-[6.5vw] tracking-tighter text-text-primary leading-[0.92] will-change-transform"
              >
                Honors & <br />
                <span className="text-text-muted">Credentials</span>
              </h1>
            </div>

            <p ref={headerDescRef} className="max-w-md font-sans text-sm sm:text-base text-text-muted leading-relaxed">
              Official records of hackathon triumphs, software engineering certifications, and academic recognitions.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div ref={searchBarRef} className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-border">
            <div className="relative group w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-full py-3 pl-11 pr-4 text-text-primary font-mono text-xs focus:outline-none focus:border-primary transition-all placeholder:text-text-muted"
                placeholder="Filter by competition, cert, or year..."
              />
            </div>

            <div className="relative self-end sm:self-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-3 px-5 py-2.5 rounded-full bg-surface border border-border text-text-primary font-mono text-xs uppercase tracking-wider hover:border-primary/50 transition-all font-bold cursor-target"
              >
                <span>SHOW {itemsPerPage} PER PAGE</span>
                <ChevronDown size={14} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-2xl shadow-xl z-30 overflow-hidden font-mono text-xs">
                  {[3, 6, 9, 12].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setItemsPerPage(num)
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-surface-elevated transition-colors ${itemsPerPage === num ? 'text-primary font-bold bg-surface-elevated' : 'text-text-muted'}`}
                    >
                      {num} ITEMS
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Layout */}
        <div ref={listRef} className="space-y-12">
          {currentAchievements.map((item, index) => {
            const themeClass = frameThemes[index % frameThemes.length];
            const isFeaturedHero = index === 0;
            const isAlternate = index % 2 === 1;

            if (isFeaturedHero) {
              // 1. Featured Lead Hero Card (Full Width Split Layout)
              return (
                <article
                  key={item.id}
                  style={{ transformStyle: 'preserve-3d' }}
                  className={`achievement-row-card w-full rounded-3xl p-8 sm:p-12 ${themeClass} border shadow-sm flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative overflow-hidden group will-change-transform transform-gpu`}
                >
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-[#444455]">
                      <span className="px-3 py-1 rounded-full bg-[#121217] text-white font-bold text-[10px]">
                        ★ HIGHLIGHTED
                      </span>
                      <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                    </div>

                    <Link href={`/achievements/${item.slug || item.id}`} className="group/title">
                      <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#121217] leading-[1.05] group-hover/title:text-[#707080] transition-colors">
                        {item.title}
                      </h2>
                    </Link>

                    <p className="text-base text-[#333344] font-sans leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <Link
                        href={`/achievements/${item.slug || item.id}`}
                        className="px-6 py-3 rounded-full bg-[#121217] text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#333344] transition-all flex items-center gap-2 cursor-target"
                      >
                        <span>VIEW FULL RECORD</span>
                        <ArrowUpRight size={14} />
                      </Link>

                      {item.imageUrl && (
                        <button
                          onClick={() => setSelectedImage(item.imageUrl)}
                          className="px-5 py-3 rounded-full bg-white/70 border border-black/10 text-[#121217] font-mono text-xs uppercase tracking-wider font-bold hover:bg-white transition-all flex items-center gap-1.5 cursor-target"
                        >
                          <span>QUICK PREVIEW</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {item.imageUrl && (
                    <Link
                      href={`/achievements/${item.slug || item.id}`}
                      className="w-full lg:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden bg-white/60 border border-black/10 shadow-lg group-hover:scale-[1.02] transition-transform duration-500 relative block"
                    >
                      <img
                        src={getOptimizedImageUrl(item.imageUrl)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-mono text-xs uppercase font-bold text-white backdrop-blur-xs">
                        VIEW FULL DETAILS ↗
                      </div>
                    </Link>
                  )}
                </article>
              );
            }

            // 2. Alternating Editorial Split Rows
            return (
              <article
                key={item.id}
                style={{ transformStyle: 'preserve-3d' }}
                className={`achievement-row-card w-full rounded-3xl p-6 sm:p-8 ${themeClass} border shadow-sm flex flex-col ${isAlternate ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  } items-center gap-8 relative overflow-hidden group will-change-transform transform-gpu`}
              >
                <div className="w-full lg:w-3/5 space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#555566]">
                    <span className="font-bold text-[#121217] flex items-center gap-1.5">
                      <Award size={14} />
                      <span>{item.status}</span>
                    </span>
                    <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                  </div>

                  <Link href={`/achievements/${item.slug || item.id}`} className="group/title block">
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#121217] leading-tight group-hover/title:text-[#707080] transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-[#444455] font-sans leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 flex items-center gap-4">
                    <Link
                      href={`/achievements/${item.slug || item.id}`}
                      className="font-mono text-xs uppercase tracking-wider font-bold text-[#121217] hover:underline flex items-center gap-1 cursor-target"
                    >
                      <span>VIEW FULL DETAILS</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>

                {item.imageUrl && (
                  <Link
                    href={`/achievements/${item.slug || item.id}`}
                    className="w-full lg:w-2/5 aspect-[16/10] rounded-2xl overflow-hidden bg-white/70 border border-black/10 shadow-md group-hover:scale-[1.02] transition-transform duration-500 relative block"
                  >
                    <img
                      src={getOptimizedImageUrl(item.imageUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                )}
              </article>
            );
          })}

          {filteredAchievements.length === 0 && (
            <div className="py-24 text-center text-[#707080] font-mono text-sm">
              No credentials found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-20 pt-8 border-t border-border font-mono text-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full border border-border bg-surface text-text-primary disabled:opacity-30 hover:border-primary/50 transition-colors cursor-target"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-4 text-text-muted font-bold">
              PAGE {currentPage} OF {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full border border-border bg-surface text-text-primary disabled:opacity-30 hover:border-primary/50 transition-colors cursor-target"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div data-lenis-prevent className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white font-mono text-xs uppercase flex items-center gap-1 cursor-target"
              >
                <span>CLOSE [ESC]</span>
                <X size={16} />
              </button>
              <img
                src={getOptimizedImageUrl(selectedImage)}
                alt="Document Preview"
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

