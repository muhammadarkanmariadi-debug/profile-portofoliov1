'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import { useLanguage } from '../providers'
import type { ProjectWithTech } from '@/lib/services/project.service'

gsap.registerPlugin(ScrollTrigger)

interface ProjectsProps {
  projects: ProjectWithTech[];
  isLanding?: boolean;
}

export default function Projects({ projects, isLanding = false }: ProjectsProps) {
  const { lang } = useLanguage()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const sectionRef = React.useRef<HTMLElement>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  const displayProjects = isLanding ? projects.slice(0, 3) : projects
  const selectedProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId) || null
    : null

  useGSAP(() => {
    if (!headingRef.current) return
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
  }, { scope: sectionRef })

  return (
    <section 
      id="work" 
      ref={sectionRef}
      className="inverted-theme w-full bg-background text-text-primary py-24 px-6 sm:px-10 border-b border-border transition-colors duration-300"
    >
      <div className="max-w-[1300px] mx-auto">

        {/* Section Header with Index (Screenshot Match) */}
        <header className="w-full border-b border-border pb-10 sm:pb-14 mb-14 sm:mb-20">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-8 sm:mb-12">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              <span>SELECTED WORK</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bold text-primary">02</span>
              {isLanding && (
                <Link href="/projects" className="hidden sm:inline-flex items-center gap-1.5 hover:text-primary transition-colors cursor-target font-bold">
                  <span>VIEW ALL</span>
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>

          {/* Big Massive Title with Mask Slide-Up Entry */}
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-heading font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.2vw] tracking-tighter leading-[0.88] uppercase text-text-primary select-none will-change-transform"
            >
              SELECTED<br />
              PROJECTS
            </h2>
          </div>
        </header>

        {/* Project Case Studies List */}
        <div className="space-y-8 relative">
          {displayProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              slug={project.slug}
              index={String(idx + 1).padStart(2, '0')}
              numericIndex={idx}
              totalProjects={displayProjects.length}
              title={project.title}
              description={project.description || ''}
              role={project.role}
              liveUrl={project.liveUrl}
              imageUrl={project.imageUrl}
              category={project.category}
              techStack={project.techStack}
              onReadMore={() => setSelectedProjectId(project.id)}
            />
          ))}
        </div>

        {/* View All Footer for Landing */}
        {isLanding && (
          <div className="mt-16 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-border bg-surface text-text-primary font-mono text-xs uppercase tracking-widest font-bold hover:border-primary/50 hover:bg-surface-elevated transition-colors cursor-target shadow-sm"
            >
              <span>VIEW ALL REPOSITORIES & PROJECTS</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

      </div>

      <ProjectModal
        isOpen={!!selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        project={selectedProject}
      />
    </section>
  )
}