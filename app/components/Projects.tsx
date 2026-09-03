'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import { useLanguage } from '../providers'
import type { ProjectWithTech } from '@/lib/services/project.service'

interface ProjectsProps {
  projects: ProjectWithTech[];
  isLanding?: boolean;
}

export default function Projects({ projects, isLanding = false }: ProjectsProps) {
  const { lang } = useLanguage()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const displayProjects = isLanding ? projects.slice(0, 3) : projects
  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId) || null 
    : null

  return (
    <section id="work" className="w-full bg-[#0B0B0E] text-[#FAFAFC] py-24 px-6 sm:px-10 border-b border-[#22222D]">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Section Header with Index (Screenshot 3 Match) */}
        <header className="w-full flex items-center justify-between border-b border-[#22222D] pb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#8E8E9F] mb-12">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white">02</span>
            <span>SELECTED PROJECTS</span>
          </div>
          <div className="flex items-center gap-6">
            <span>{String(displayProjects.length).padStart(2, '0')}</span>
            {isLanding && (
              <Link href="/projects" className="hidden sm:inline-flex items-center gap-1 hover:text-white transition-colors cursor-target">
                <span>VIEW ALL</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </header>

        {/* Project Case Studies List */}
        <div className="space-y-12">
          {displayProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              slug={project.slug}
              index={String(idx + 1).padStart(2, '0')}
              title={lang === 'id' ? project.titleId : project.titleEn}
              description={lang === 'id' ? (project.descriptionId || '') : (project.descriptionEn || '')}
              role={lang === 'id' ? project.roleId : project.roleEn}
              liveUrl={project.liveUrl}
              imageUrl={project.imageUrl}
              category={lang === 'id' ? project.categoryId : project.categoryEn}
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
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#2E2E3C] bg-[#121217] text-white font-mono text-xs uppercase tracking-widest font-bold hover:border-white transition-colors cursor-target"
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