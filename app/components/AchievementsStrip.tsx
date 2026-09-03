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
    <section id="achievements" className="w-full bg-[#0B0B0E] text-[#FAFAFC] py-24 px-6 sm:px-10 border-b border-[#22222D]">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Section Header with Index */}
        <header className="w-full flex items-center justify-between border-b border-[#22222D] pb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#8E8E9F] mb-12">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white">04</span>
            <span>VERIFIED CREDENTIALS & RECOGNITION</span>
          </div>
          <Link href="/achievements" className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-target font-bold">
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
              className="p-6 rounded-2xl bg-[#14141C] border border-[#22222F] hover:border-[#6C63FF]/60 transition-colors flex flex-col justify-between group cursor-target transform-gpu shadow-md hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[#8E8E9F] mb-4">
                  <span className="flex items-center gap-1.5 text-[#00E599] font-bold">
                    <Award size={14} />
                    <span>{lang === 'id' ? item.statusId : item.statusEn}</span>
                  </span>
                  <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                </div>

                <h4 className="font-heading font-bold text-lg text-white group-hover:text-[#6C63FF] transition-colors mb-2">
                  {lang === 'id' ? item.titleId : item.titleEn}
                </h4>

                <p className="text-sm text-[#A0A0B2] font-sans leading-relaxed line-clamp-2">
                  {lang === 'id' ? item.descriptionId : item.descriptionEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#22222F] flex items-center justify-between font-mono text-xs text-[#707085]">
                <span>VERIFIED ENTRY</span>
                <Link href={`/achievements/${item.slug || item.id}`} className="group-hover:text-white transition-colors flex items-center gap-1 font-bold">
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
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#8E8E9F] hover:text-white transition-colors cursor-target border-b border-[#2E2E3C] pb-1"
          >
            <span>{t.achievements.viewAll || 'VIEW ALL VERIFIED AWARDS & CERTIFICATES'}</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  )
}
