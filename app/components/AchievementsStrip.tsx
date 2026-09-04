'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Award } from 'lucide-react'
import { useLanguage } from '../providers'
import type { Achievement } from '@prisma/client'

interface AchievementsStripProps {
  achievements: Achievement[];
}

export default function AchievementsStrip({ achievements }: AchievementsStripProps) {
  const { lang, t } = useLanguage()

  if (!achievements || achievements.length === 0) return null

  return (
    <section id="achievements" className="w-full bg-background text-text-primary py-24 px-6 sm:px-10 border-b border-border transition-colors duration-300">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Section Header with Index */}
        <header className="w-full flex items-center justify-between border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-12">
          <div className="flex items-center gap-4">
            <span className="font-bold text-primary">04</span>
            <span>VERIFIED CREDENTIALS & RECOGNITION</span>
          </div>
          <Link href="/achievements" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors cursor-target font-bold">
            <span>FULL ARCHIVE</span>
            <ArrowUpRight size={13} />
          </Link>
        </header>

        {/* Credentials Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.slice(0, 6).map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/60 hover:bg-surface-elevated transition-all flex flex-col justify-between group cursor-target transform-gpu shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-text-muted mb-4">
                  <span className="flex items-center gap-1.5 text-primary font-bold">
                    <Award size={14} />
                    <span>{lang === 'id' ? item.statusId : item.statusEn}</span>
                  </span>
                  <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                </div>

                <h4 className="font-heading font-bold text-lg text-text-primary group-hover:text-primary transition-colors mb-2">
                  {lang === 'id' ? item.titleId : item.titleEn}
                </h4>

                <p className="text-sm text-text-muted font-sans leading-relaxed line-clamp-2">
                  {lang === 'id' ? item.descriptionId : item.descriptionEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between font-mono text-xs text-text-muted">
                <span>VERIFIED ENTRY</span>
                <Link href={`/achievements/${item.slug || item.id}`} className="group-hover:text-primary transition-colors flex items-center gap-1 font-bold">
                  <span>DETAILS</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/achievements" 
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-muted hover:text-primary transition-colors cursor-target border-b border-border pb-1"
          >
            <span>{t.achievements.viewAll || 'VIEW ALL VERIFIED AWARDS & CERTIFICATES'}</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  )
}
