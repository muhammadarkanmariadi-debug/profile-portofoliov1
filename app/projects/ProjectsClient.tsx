'use client'
import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import ProjectCard from '@/app/components/ProjectCard'
import ProjectModal from '@/app/components/ProjectModal'
import { useLanguage } from '@/app/providers'
import type { ProjectWithTech } from '@/lib/services/project.service'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface ProjectsClientProps {
  initialProjects: ProjectWithTech[]
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  
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

  const filteredProjects = initialProjects.filter(project => {
    const title = project.title || ''
    const category = project.category || ''
    
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           category.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  
  // Slice for current page
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const selectedProject = selectedProjectId 
    ? initialProjects.find(p => p.id === selectedProjectId) || null 
    : null

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

  // Stagger cards when page or search changes
  useGSAP(() => {
    if (!listRef.current) return
    const cards = listRef.current.querySelectorAll('.project-card-wrapper')
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 35, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          clearProps: 'transform'
        }
      )
    }
  }, { dependencies: [currentPage, searchQuery, itemsPerPage], scope: containerRef })

  return (
    <main
      ref={containerRef}
      className="w-full bg-background text-text-primary pt-28 pb-32 min-h-screen px-6 sm:px-10 relative overflow-hidden select-none border-b border-border transition-colors duration-300"
    >
      
      {/* Background Watermark 02 */}
      <div
        ref={watermarkRef}
        className="absolute top-20 right-0 font-heading font-black text-[25vw] leading-none text-text-primary opacity-[0.03] pointer-events-none -z-0 will-change-transform"
      >
        02
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Editorial Top Section Header */}
        <header className="mb-16 border-b border-border pb-10">
          
          {/* Index & Breadcrumb */}
          <div ref={headerMetaRef} className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-text-muted mb-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-primary">02</span>
              <span>SELECTED REPOSITORIES & SYSTEMS</span>
            </div>
            <span>PRODUCTION INDEX</span>
          </div>

          {/* Giant Typography */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="overflow-hidden">
              <h1
                ref={headingRef}
                className="font-heading font-black text-5xl sm:text-7xl lg:text-[6.5vw] tracking-tighter text-text-primary leading-[0.92] will-change-transform"
              >
                Selected <br />
                <span className="text-text-muted">Architecture</span>
              </h1>
            </div>

            <p ref={headerDescRef} className="max-w-md font-sans text-sm sm:text-base text-text-muted leading-relaxed">
              High-performance production web systems, real-time architectures, and enterprise platforms engineered for scale.
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
                placeholder="Search by name, technology stack, or category..."
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

        {/* Dynamic Project Cases */}
        <div ref={listRef} className="space-y-16">
          {currentProjects.map((project, index) => (
            <div
              key={project.id}
              className="project-card-wrapper will-change-transform"
            >
              <ProjectCard
                id={project.id}
                slug={project.slug}
                index={String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                numericIndex={index}
                totalProjects={currentProjects.length}
                title={project.title}
                description={project.description || ''}
                role={project.role}
                liveUrl={project.liveUrl}
                imageUrl={project.imageUrl || ''}
                category={project.category}
                techStack={project.techStack}
                onReadMore={() => setSelectedProjectId(project.id)}
              />
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="py-24 text-center text-text-muted font-mono text-sm">
              No projects found matching &quot;{searchQuery}&quot;
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

      <ProjectModal 
        isOpen={!!selectedProjectId} 
        onClose={() => setSelectedProjectId(null)} 
        project={selectedProject} 
      />
    </main>
  )
}

