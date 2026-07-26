'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useLanguage } from '../providers'

interface AchievementCardProps {
  id: string
  title: string
  description: string
  imageUrl: string | null
  status: string
  date: Date
}

const AchievementCard = ({
  title,
  description,
  imageUrl,
  status,
  date
}: AchievementCardProps) => {
  const { t } = useLanguage()

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className='group glass-card rounded-2xl overflow-hidden flex flex-col h-full cursor-target'
    >
      <div className='relative w-full aspect-[4/3] overflow-hidden bg-surface'>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          src={imageUrl || 'https://images.unsplash.com/photo-1590402494682-bf34f5ce8c50?w=800&auto=format&fit=crop&q=60'}
          alt={title}
          className='w-full h-full object-contain transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-90' />
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="px-2 py-1 bg-background/80 backdrop-blur-md rounded border border-border text-[10px] uppercase font-mono text-primary cursor-target">
            {status}
          </span>
        </div>
      </div>
      
      <div className='p-6 flex flex-col flex-grow relative z-10 -mt-6'>
        <h3 className='font-heading font-bold text-on-surface text-2xl mb-3 group-hover:text-primary transition-colors'>
          {title}
        </h3>
        
        <p className='text-on-surface-variant text-sm leading-relaxed flex-grow font-sans mb-4 line-clamp-3'>
          {description}
        </p>

        <p className="font-mono text-[10px] text-on-surface-variant/50 mb-6">
          {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>

        <div className="flex items-center mt-auto pt-4">
          <a 
            href={imageUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center items-center gap-2 border border-primary text-primary py-3 rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-all cursor-target"
          >
            {t.achievements.cardView}
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default AchievementCard
