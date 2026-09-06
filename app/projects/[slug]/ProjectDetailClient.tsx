'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Github, Layers, Calendar, UserCheck } from 'lucide-react'
import type { Project, Skill } from '@prisma/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { getOptimizedImageUrl } from '@/lib/utils/image'

gsap.registerPlugin(ScrollTrigger)

type ProjectWithTech = Project & { techStack?: Skill[] }

interface ProjectDetailClientProps {
  project: ProjectWithTech
  nextProject?: ProjectWithTech | null
}

export default function ProjectDetailClient({ project, nextProject }: ProjectDetailClientProps) {
  const containerRef = useRef<HTMLElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)
  const navBarRef = useRef<HTMLDivElement>(null)
  const metaBadgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const frameInnerRef = useRef<HTMLDivElement>(null)
  const gridMetaRef = useRef<HTMLDivElement>(null)
  const nextProjectRef = useRef<HTMLDivElement>(null)

  const displayDomain = project.liveUrl 
    ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') 
    : '4rkan.dev/case-study'

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

    // 2. Main Entrance Sequence
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

    if (frameRef.current) {
      tl.fromTo(
        frameRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
        '-=0.3'
      )
    }

    // 3. 3D Frame Tilt on Hover (fine pointer only)
    if (frameInnerRef.current && typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const el = frameInnerRef.current
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

    // 4. Grid Metadata Entrance on Scroll
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

    // 5. Next Project Footer Entrance
    if (nextProjectRef.current) {
      gsap.fromTo(
        nextProjectRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: nextProjectRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }
  }, { scope: containerRef, dependencies: [project.id] })

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
        PROJECT
      </div>

      <div className="max-w-[1350px] mx-auto relative z-10">
        {/* Top Back Navigation Bar */}
        <div
          ref={navBarRef}
          className="flex items-center justify-between border-b border-border pb-6 mb-12 font-mono text-xs uppercase tracking-[0.2em] text-text-muted"
        >
          <Link
            href="/projects"
            className="flex items-center gap-2 hover:text-primary transition-colors cursor-target font-bold"
          >
            <ArrowLeft size={14} />
            <span>BACK TO ARCHIVE</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="font-bold text-primary">02</span>
            <span>CASE STUDY</span>
          </div>
        </div>

        {/* Project Header */}
        <header className="mb-14 space-y-6">
          <div ref={metaBadgeRef} className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-text-muted">
            <span className="px-3 py-1 rounded-full bg-primary text-background font-bold text-[10px]">
              {project.category}
            </span>
            <span>·</span>
            <span>{project.role || 'Full-Stack Software Engineer'}</span>
          </div>

          <div className="overflow-hidden">
            <h1
              ref={headingRef}
              className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] tracking-tighter text-text-primary leading-[0.95] max-w-5xl will-change-transform"
            >
              {project.title}
            </h1>
          </div>

          <p ref={descRef} className="text-lg sm:text-xl text-text-muted font-sans max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {/* Action CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-primary text-background hover:opacity-90 font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-target shadow-lg"
              >
                <span>VISIT LIVE PLATFORM</span>
                <ArrowUpRight size={15} />
              </a>
            )}

            {project.sourceCodeUrl && (
              <a
                href={project.sourceCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-surface border border-border hover:border-primary/50 text-text-primary font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-target shadow-sm"
              >
                <Github size={15} />
                <span>SOURCE CODE</span>
              </a>
            )}
          </div>
        </header>

        {/* Desktop Browser Mockup Frame Showcase */}
        <div ref={frameRef} className="w-full rounded-3xl p-4 sm:p-8 md:p-10 bg-surface border border-border shadow-xl mb-16 overflow-hidden">
          <div
            ref={frameInnerRef}
            className="w-full bg-[#14141E] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transform-gpu will-change-transform"
          >
            {/* Window Top Bar */}
            <div className="bg-[#111216] px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]/80 inline-block" />
              </div>

              <div className="flex-1 max-w-md mx-4">
                <div className="bg-[#1C1F26] rounded-md px-3 py-1 text-[11px] font-mono text-[#7A7A90] text-center truncate">
                  https://{displayDomain}
                </div>
              </div>

              <div className="w-10" />
            </div>

            {/* Screen Image Preview */}
            <div className="w-full aspect-[16/9] bg-[#0D0E11] relative flex items-center justify-center overflow-hidden">
              {project.imageUrl ? (
                <img
                  src={getOptimizedImageUrl(project.imageUrl)}
                  alt={project.title}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="text-center font-mono text-xs text-text-muted p-8">
                  NO PREVIEW IMAGE AVAILABLE
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Technical Meta & Architecture Grid */}
        <div ref={gridMetaRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-border pt-14 mb-20">
          {/* Left Metadata Matrix */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-3 flex items-center gap-2 font-bold">
                <Layers size={14} className="text-primary" />
                <span>TECH STACK & TOOLS</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3.5 py-1.5 rounded-full bg-surface border border-border font-mono text-xs text-text-primary flex items-center gap-2 font-bold shadow-xs hover:border-primary/50 transition-colors"
                  >
                    {skill.logoUrl && (
                      <img src={skill.logoUrl} alt={skill.title} className="w-3.5 h-3.5 object-contain" />
                    )}
                    <span>{skill.title}</span>
                  </span>
                ))}
                {(!project.techStack || project.techStack.length === 0) && (
                  <span className="font-mono text-xs text-text-muted">Full-Stack Suite</span>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-2 flex items-center gap-2 font-bold">
                <UserCheck size={14} className="text-primary" />
                <span>CORE RESPONSIBILITIES</span>
              </h3>
              <p className="text-sm text-text-muted font-sans leading-relaxed">
                {project.role || 'Full-Stack Software Engineering · Interface Design · API Architecture'}
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-2 flex items-center gap-2 font-bold">
                <Calendar size={14} className="text-primary" />
                <span>RELEASE TIMELINE</span>
              </h3>
              <p className="text-sm font-mono text-text-muted">
                {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right Narrative / Overview */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-4 font-bold">
                SYSTEM ARCHITECTURE & CONTEXT
              </h3>
              <div className="prose max-w-none text-text-primary font-sans text-base leading-relaxed space-y-4">
                <p>{project.description}</p>
                {project.readmeContent && (
                  <div
                    data-lenis-prevent
                    className="mt-8 p-6 rounded-2xl bg-surface border border-border font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed text-text-primary shadow-inner"
                  >
                    {project.readmeContent}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Next Project Footer Strip */}
        {nextProject && (
          <div
            ref={nextProjectRef}
            className="border-t border-border pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-wider"
          >
            <span className="text-text-muted">CONTINUE EXPLORING</span>
            <Link
              href={`/projects/${nextProject.slug || nextProject.id}`}
              className="flex items-center gap-3 text-lg sm:text-2xl font-heading font-black text-text-primary hover:text-primary transition-colors cursor-target group"
            >
              <span>NEXT: {nextProject.title}</span>
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
