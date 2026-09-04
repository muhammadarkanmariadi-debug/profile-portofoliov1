'use client'
import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useLanguage } from '../providers'
import type { Achievement } from '@prisma/client'

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements = ({ achievements }: AchievementsProps) => {
  const { t, lang } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      // If at the end, jump back to start for auto-loop feeling
      const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth
      if (scrollRef.current.scrollLeft >= maxScrollLeft - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' })
      }
    }
  }

  // Auto scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight()
    }, 4000) // Scroll every 4 seconds

    return () => clearInterval(interval)
  }, [achievements.length])

  if (achievements.length === 0) return null;

  return (
    <section className="inverted-theme py-24 px-6 md:px-10 bg-background text-text-primary relative overflow-hidden" id="achievements">
      {/* Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-[1300px] mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-sm text-primary uppercase tracking-widest"
          >
            {t.achievements.badge}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="font-heading text-4xl lg:text-5xl text-on-surface font-bold"
          >
            {t.achievements.title}
          </motion.h2>
        </div>

        <div className="relative group">
          {/* Scroll Buttons */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-surface/80 backdrop-blur border border-border text-on-surface rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:text-primary hover:border-primary shadow-xl cursor-target"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-surface/80 backdrop-blur border border-border text-on-surface rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:text-primary hover:border-primary shadow-xl cursor-target"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Container */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide scroll-smooth items-stretch touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {achievements.map((item, idx) => {
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-none snap-center glass-card p-5 rounded-2xl flex flex-col items-center text-center space-y-3 border-b-2 border-border hover:border-primary hover:-translate-y-1 transition-all cursor-target"
                >
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-border bg-surface shrink-0">
                    <img 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1590402494682-bf34f5ce8c50?w=800&auto=format&fit=crop&q=60'} 
                      alt={`Certificate for ${item.title}`} 
                      className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity hover:scale-105 duration-500"
                    />
                  </div>
                  <h4 className="font-heading text-xl font-bold text-on-surface">{item.title}</h4>
                  <p className="font-mono text-xs uppercase font-semibold text-primary">
                    {item.status}
                  </p>
                  <p className="text-on-surface-variant text-sm leading-relaxed flex-grow line-clamp-3">{item.description}</p>
                  <p className="font-mono text-[10px] text-on-surface-variant/50 mt-auto pt-4 mb-3">
                    {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <a 
                    href={item.imageUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex justify-center items-center gap-2 border border-primary text-primary py-2.5 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all cursor-target"
                  >
                    {t.achievements.cardView}
                    <ExternalLink size={14} />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Achievements
