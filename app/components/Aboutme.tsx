'use client'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowDown, GraduationCap, Briefcase } from 'lucide-react'
import { useLanguage } from '../providers'
import type { Profile, TimelineEntry } from '@prisma/client'

interface AboutmeProps {
  profile?: Profile | null;
  timeline?: TimelineEntry[];
}

function KineticWord({ word, progress, range }: { word: string; progress: any; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  const color = useTransform(progress, range, ['#A8A8B8', '#121217'])
  const y = useTransform(progress, range, ['4px', '0px'])

  return (
    <motion.span 
      style={{ opacity, color, y }} 
      className="inline-block mr-[0.3em] transition-colors transform-gpu will-change-transform"
    >
      {word}
    </motion.span>
  )
}

export default function Aboutme({ profile: _profile, timeline = [] }: AboutmeProps) {
  const { lang } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.4']
  })

  const statement1 = lang === 'id' 
    ? "Arkan memadukan rekayasa perangkat lunak full-stack dengan arsitektur digital modern yang mutakhir."
    : "Muhammad Arkan blends full-stack software engineering with cutting-edge digital architecture."

  const statement2 = lang === 'id'
    ? "Kami membangun sistem web produksi berkinerja tinggi melalui setiap proyek yang kami rilis ke publik."
    : "We shape high-performance production web systems through each project we design and ship."

  const words1 = statement1.split(' ')
  const words2 = statement2.split(' ')
  const totalWords = words1.length + words2.length

  const educationEntries = timeline.filter(item => item.type === 'EDUCATION')
  const experienceEntries = timeline.filter(item => item.type === 'EXPERIENCE')

  return (
    <section 
      id="about"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#EBEBEF] text-[#121217] flex flex-col justify-between p-6 sm:p-10 select-none border-b border-[#D8D8E0]"
    >
      {/* Top Section Header with Index (Screenshot 2 Match) */}
      <header className="w-full flex items-center justify-between border-b border-[#D5D5DF] pb-4 font-mono text-xs uppercase tracking-[0.2em] text-[#707080]">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#121217]">01</span>
          <span>ABOUT 4RK4N.DEV</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 sm:gap-8 text-[11px] sm:text-xs">
          <Link href="#work" className="hover:text-[#121217] transition-colors cursor-target">WORK</Link>
          <Link href="#about" className="hover:text-[#121217] font-bold text-[#121217] transition-colors cursor-target">ABOUT</Link>
          <Link href="#skills" className="hover:text-[#121217] transition-colors cursor-target">SKILLS</Link>
          <Link href="#achievements" className="hidden md:inline-block hover:text-[#121217] transition-colors cursor-target">CREDENTIALS</Link>
          <Link href="#contact" className="hover:text-[#121217] transition-colors cursor-target">CONTACT</Link>
        </div>
      </header>

      {/* Kinetic Statement Centerpiece */}
      <div className="max-w-[1250px] mx-auto my-auto py-16 sm:py-24">
        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[4.8vw] tracking-tight leading-[1.12] text-[#121217]">
          
          {/* First Sentence */}
          <div className="mb-6 flex flex-wrap">
            {words1.map((word, i) => {
              const start = i / totalWords
              const end = (i + 1) / totalWords
              return (
                <KineticWord 
                  key={`s1-${i}`} 
                  word={word} 
                  progress={scrollYProgress} 
                  range={[start, end]} 
                />
              )
            })}
          </div>

          {/* Second Sentence */}
          <div className="flex flex-wrap">
            {words2.map((word, i) => {
              const index = words1.length + i
              const start = index / totalWords
              const end = (index + 1) / totalWords
              return (
                <KineticWord 
                  key={`s2-${i}`} 
                  word={word} 
                  progress={scrollYProgress} 
                  range={[start, end]} 
                />
              )
            })}
          </div>

        </h2>

        {/* Structured Credentials & Timeline Dropdown */}
        {timeline.length > 0 && (
          <div className="mt-20 pt-10 border-t border-[#D5D5DF] grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Education */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#666675]">
                <GraduationCap size={16} />
                <span>EDUCATION</span>
              </div>
              <div className="space-y-4 pl-3 border-l border-[#C8C8D5]">
                {educationEntries.map(item => (
                  <div key={item.id}>
                    <h4 className="font-bold text-base text-[#121217]">{lang === 'id' ? item.titleId : item.titleEn}</h4>
                    <p className="text-xs font-mono text-[#666675] mt-0.5">{lang === 'id' ? item.categoryId : item.categoryEn}</p>
                    <p className="text-sm text-[#444455] mt-1">{lang === 'id' ? item.descriptionId : item.descriptionEn}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#666675]">
                <Briefcase size={16} />
                <span>EXPERIENCE</span>
              </div>
              <div className="space-y-4 pl-3 border-l border-[#C8C8D5]">
                {experienceEntries.map(item => (
                  <div key={item.id}>
                    <h4 className="font-bold text-base text-[#121217]">{lang === 'id' ? item.titleId : item.titleEn}</h4>
                    <p className="text-xs font-mono text-[#666675] mt-0.5">{lang === 'id' ? item.categoryId : item.categoryEn}</p>
                    <p className="text-sm text-[#444455] mt-1">{lang === 'id' ? item.descriptionId : item.descriptionEn}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Line & Next Section Jump Arrow */}
      <footer className="w-full flex items-center justify-between border-t border-[#D5D5DF] pt-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#707080]">CAPABILITIES & BACKGROUND</span>
        <Link 
          href="#work" 
          aria-label="Continue to projects"
          className="w-10 h-10 rounded-full border border-[#B0B0C0] flex items-center justify-center text-[#121217] hover:bg-[#121217] hover:text-white transition-colors cursor-target"
        >
          <ArrowDown size={18} />
        </Link>
      </footer>
    </section>
  )
}