'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, Code2, Tag, Server } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '../providers'
import { getOptimizedImageUrl } from '@/lib/utils/image'

import type { Project, Skill } from '@prisma/client'

type ProjectWithTech = Project & { techStack: Skill[] };

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: ProjectWithTech | null
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
  const { t, lang } = useLanguage()

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-target"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-surface/90 border border-border rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/50 backdrop-blur-md rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-background transition-colors cursor-target"
            >
              <X size={20} />
            </button>

            {/* Left Image Section */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative shrink-0">
              <img 
                src={getOptimizedImageUrl(project.imageUrl) || '/images/default-project.jpg'} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface to-transparent opacity-90 md:opacity-50" />
            </div>

            {/* Right Content Section */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 overflow-y-auto flex flex-col" data-lenis-prevent>
              <div className="flex items-center gap-2 mb-4">
                <Tag size={16} className="text-secondary" />
                <span className="font-mono text-xs uppercase tracking-widest text-secondary">{project.category}</span>
              </div>
              
              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-on-surface mb-2 text-glow">{project.title}</h3>
              
              {project.role && (
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full font-mono text-xs text-primary">
                    {t.projects.modalRole}: {project.role}
                  </span>
                </div>
              )}
              
              <div className="prose prose-invert prose-p:text-on-surface-variant prose-p:leading-relaxed mb-8">
                <p>{project.description}</p>
              </div>

              {project.techStack && (
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-on-surface-variant mb-4">
                    <Code2 size={16} /> {t.projects.modalTech}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech.id} className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-mono text-on-surface cursor-target">
                        {tech.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto pt-6 border-t border-border">
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all cursor-target"
                  >
                    <ExternalLink size={18} /> {t.projects.modalLive}
                  </a>
                )}
                {project.sourceCodeUrl && (
                  <a 
                    href={project.sourceCodeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-border text-on-surface hover:border-primary/50 py-3 px-4 rounded-xl font-mono text-sm font-bold uppercase tracking-wider transition-all cursor-target"
                  >
                    <Github size={18} /> {t.projects.modalSource}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProjectModal
