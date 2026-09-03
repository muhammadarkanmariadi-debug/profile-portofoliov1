'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '../providers'
import type { Profile } from '@prisma/client'

const ChromeTorus = dynamic(() => import('@/components/ChromeTorus'), { 
  ssr: false,
  loading: () => <div className="w-full h-full" />
})

interface HeroProps {
  profile?: Profile | null;
}

export default function Hero({ profile: _profile }: HeroProps) {
  const { lang } = useLanguage()
  const sectionRef = React.useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })

  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0.2])
  const scaleTorus = useTransform(scrollYProgress, [0, 1], [1, 0.85])

  return (
    <section 
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#EBEBEF] text-[#121217] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden border-b border-[#D8D8E0]"
    >
      {/* Top Navigation & Meta Bar */}
      <header className="w-full flex items-center justify-between z-30 font-mono text-xs uppercase tracking-[0.2em]">
        <Link href="#home" className="font-bold flex items-center gap-2 group cursor-target">
          <span className="w-7 h-7 rounded border border-[#121217] flex items-center justify-center text-[10px] font-black group-hover:bg-[#121217] group-hover:text-white transition-colors">
            4R
          </span>
          <span className="hidden sm:inline font-extrabold tracking-wider">4RK4N.DEV</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-8 md:gap-10 text-[#555566] text-[11px] sm:text-xs">
          <Link href="#work" className="hover:text-[#121217] transition-colors cursor-target font-medium">
            WORK
          </Link>
          <Link href="#about" className="hover:text-[#121217] transition-colors cursor-target font-medium">
            ABOUT
          </Link>
          <Link href="#skills" className="hover:text-[#121217] transition-colors cursor-target font-medium">
            SKILLS
          </Link>
          <Link href="#achievements" className="hidden sm:inline-block hover:text-[#121217] transition-colors cursor-target font-medium">
            CREDENTIALS
          </Link>
          <Link href="#contact" className="hover:text-[#121217] transition-colors cursor-target font-medium">
            CONTACT
          </Link>
        </nav>
      </header>

      {/* Centerpiece: Huge Typography + 3D Chrome Torus + Hairline Ticks */}
      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative w-full flex-grow flex items-center justify-center my-auto py-8 transform-gpu"
      >
        
        {/* Horizontal Hairline & Ticks */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex items-center justify-between pointer-events-none z-0 px-4 opacity-70">
          <div className="w-1/4 h-[1px] bg-[#C8C8D2]"></div>
          <div className="flex gap-2 text-[#A0A0B0] font-mono text-[9px]">
            <span>+</span>
            <span>-</span>
            <span>+</span>
          </div>
          <div className="w-1/3 h-[1px] bg-[#C8C8D2]"></div>
          <div className="flex gap-2 text-[#A0A0B0] font-mono text-[9px]">
            <span>+</span>
            <span>-</span>
            <span>+</span>
          </div>
          <div className="w-1/4 h-[1px] bg-[#C8C8D2]"></div>
        </div>

        {/* 3-Row Giant Typography */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center pointer-events-none w-full max-w-[1400px]">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-black tracking-tighter leading-[0.88] text-[#121217] uppercase w-full flex flex-col items-center justify-center select-none"
          >
            <span className="text-[13vw] sm:text-[12vw] lg:text-[15vw] leading-none block">
              {lang === 'id' ? 'DIGITAL' : 'DIGITAL'}
            </span>
            <span className="text-[13vw] sm:text-[12vw] lg:text-[15vw] leading-none block">
              {lang === 'id' ? 'DESIGN' : 'DESIGN'}
            </span>
            <span className="text-[8.2vw] sm:text-[7.2vw] lg:text-[9.2vw] leading-none block">
              {lang === 'id' ? 'EXPERIENCE' : 'EXPERIENCE'}
            </span>
          </motion.h1>
        </div>

        {/* 3D Chrome Torus Knot Layered in the Center */}
        <motion.div 
          style={{ scale: scaleTorus }}
          className="absolute z-20 w-[90px] h-[90px] sm:w-[150px] sm:h-[150px] lg:w-[600px] lg:h-[600px] pointer-events-none flex items-center justify-center overflow-visible transform-gpu"
        >
          <ChromeTorus />
        </motion.div>

      </motion.div>

      {/* Bottom Meta Bar */}
      <footer className="w-full flex items-center justify-between z-30 font-mono text-xs uppercase tracking-[0.2em] text-[#707080] pt-4">
        <span>4RK4N.DEV</span>
        <Link href="#about" className="flex items-center gap-1.5 hover:text-[#121217] transition-colors cursor-target font-semibold">
          <span>SCROLL TO EXPLORE</span>
          <span>↓</span>
        </Link>
      </footer>
    </section>
  )
}
