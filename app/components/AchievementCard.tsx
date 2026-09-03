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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="editorial-card rounded-2xl overflow-hidden flex flex-col h-full cursor-target group bg-surface border border-border hover:border-primary/50"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-background border-b border-border">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1590402494682-bf34f5ce8c50?w=800&auto=format&fit=crop&q=60'}
          alt={title}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className="px-2.5 py-1 bg-background/90 rounded-md border border-border text-[10px] uppercase font-mono text-secondary font-semibold">
            {status}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-mono text-xs text-on-surface-variant/60">
            {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          </span>
        </div>

        <h3 className="font-heading font-bold text-on-surface text-xl group-hover:text-primary transition-colors mb-3">
          {title}
        </h3>
        
        <p className="text-on-surface-variant text-sm leading-relaxed flex-grow font-sans mb-6 line-clamp-3">
          {description}
        </p>

        <div className="mt-auto pt-3 border-t border-border/40">
          <a 
            href={imageUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold border border-border hover:border-primary hover:bg-primary hover:text-white transition-all cursor-target text-on-surface"
          >
            <span>{t.achievements.cardView}</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default AchievementCard
