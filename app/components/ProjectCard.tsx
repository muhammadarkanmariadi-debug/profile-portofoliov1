'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { useLanguage } from '../providers'

interface ProjectCardProps {
  title: string
  description: string
  imageUrl: string | null
  id: string
  category: string
  onReadMore?: () => void
}

const ProjectCard = ({
  id,
  title,
  description,
  imageUrl,
  category,
  onReadMore
}: ProjectCardProps) => {
  const { t } = useLanguage()

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className='group glass-card rounded-2xl overflow-hidden flex flex-col h-full cursor-target'
    >
      <div className='relative w-full h-56 overflow-hidden'>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          src={imageUrl || '/images/default-project.jpg'}
          alt={title}
          className='w-full h-full object-cover transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-90' />
        <div className="absolute top-4 right-4 flex gap-2">
          {category.split(',').map((cat, idx) => (
            <span key={idx} className="px-2 py-1 bg-background/80 backdrop-blur-md rounded border border-border text-[10px] uppercase font-mono text-on-surface-variant cursor-target">
              {cat.trim()}
            </span>
          ))}
        </div>
      </div>
      
      <div className='p-6 flex flex-col flex-grow relative z-10 -mt-6'>
        <h3 className='font-heading font-bold text-on-surface text-2xl mb-3 group-hover:text-primary transition-colors'>
          {title}
        </h3>
        
        <p className='text-on-surface-variant text-sm leading-relaxed flex-grow font-sans mb-6 line-clamp-3'>
          {description}
        </p>

        <div className="flex items-center mt-auto pt-4">
          <button 
            onClick={onReadMore}
            className="w-full flex justify-center items-center gap-2 border border-primary text-primary py-3 rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-all cursor-target"
          >
            {t.projects.cardReadMore}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard