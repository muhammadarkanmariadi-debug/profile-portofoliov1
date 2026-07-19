'use client'
import React, { useState } from 'react'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import { projects } from '../../lib/data'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Terminal } from 'lucide-react'
import { useLanguage } from '../providers'
import type { ProjectWithTech } from '@/lib/services/project.service'

interface ProjectsProps {
  projects: ProjectWithTech[];
}

const Projects = ({ projects }: ProjectsProps) => {
  const { t, lang } = useLanguage()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  
  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId) || null 
    : null

  return (
    <section className="py-24 px-6 md:px-10 bg-background relative" id="work">
      {/* Background Element */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-surface/50 to-transparent pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full skill-badge mb-4 cursor-target"
            >
              <Terminal size={14} className="text-secondary" />
              <span className="font-mono text-xs uppercase text-on-surface">{t.projects.badge}</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="font-heading text-4xl lg:text-5xl mb-4 text-glow text-on-surface font-bold"
            >
              {t.projects.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="font-sans text-lg text-on-surface-variant leading-relaxed"
            >
              {t.projects.desc}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:text-white font-mono text-sm uppercase tracking-widest transition-colors group cursor-target">
              {t.projects.viewAll} 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <ProjectCard
                id={project.id}
                title={lang === 'id' ? project.titleId : project.titleEn}
                description={lang === 'id' ? (project.descriptionId || '') : (project.descriptionEn || '')}
                imageUrl={project.imageUrl}
                category={lang === 'id' ? project.categoryId : project.categoryEn}
                onReadMore={() => setSelectedProjectId(project.id)}
              />
            </motion.div>
          ))}
        </div>

      </div>

      <ProjectModal 
        isOpen={!!selectedProjectId} 
        onClose={() => setSelectedProjectId(null)} 
        project={selectedProject} 
      />
    </section>
  )
}

export default Projects