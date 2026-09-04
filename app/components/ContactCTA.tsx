'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { useSmoothScroll } from '../providers/SmoothScrollProvider'
import type { Profile } from '@prisma/client'

interface ContactCTAProps {
  profile?: Profile | null;
}

export default function ContactCTA({ profile }: ContactCTAProps) {
  const [copied, setCopied] = useState(false)
  const { scrollTo } = useSmoothScroll()

  const email = profile?.email || 'muhammadarkanmariadi@gmail.com'

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <section 
      id="contact"
      className="relative w-full min-h-screen bg-[#82D8CE] text-[#121217] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden border-t border-[#6AC4B9]"
    >
      {/* Background Watermark 05 */}
      <div className="absolute right-0 bottom-10 font-heading font-black text-[28vw] leading-none text-[#121217] opacity-[0.07] pointer-events-none z-0">
        05
      </div>

      {/* Top Section Header with Index (Screenshot 4 Match) */}
      <header className="w-full flex items-center justify-between border-b border-[#6AC4B9] pb-4 font-mono text-xs uppercase tracking-[0.2em] text-[#2C625B] z-10">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#121217]">05</span>
          <span>CONTACT</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 sm:gap-8 text-[11px] sm:text-xs">
          <Link href="#work" className="hover:text-[#121217] transition-colors cursor-target">WORK</Link>
          <Link href="#about" className="hover:text-[#121217] transition-colors cursor-target">ABOUT</Link>
          <Link href="#skills" className="hover:text-[#121217] transition-colors cursor-target">SKILLS</Link>
          <Link href="#achievements" className="hidden md:inline-block hover:text-[#121217] transition-colors cursor-target">CREDENTIALS</Link>
          <Link href="#contact" className="hover:text-[#121217] font-bold text-[#121217] transition-colors cursor-target">CONTACT</Link>
        </div>
      </header>

      {/* Center Body: Headline & Full-width Pill Bar */}
      <div className="w-full max-w-[1300px] mx-auto my-auto py-12 sm:py-20 z-10">
        
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#2C625B] font-semibold mb-6">
          HAVE A PROJECT IN MIND?
        </p>

        {/* 3-Line Headline with Wireframe Outline on last line */}
        <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[6.5vw] tracking-tighter leading-[0.95] text-[#121217] mb-12 sm:mb-16">
          <span>Let&#39;s make</span> <br />
          <span>something impossible</span> <br />
          <span 
            className="text-transparent inline-block"
            style={{ 
              WebkitTextStroke: '2px currentColor'
            }}
          >
            to ignore.
          </span>
        </h2>

        {/* Full-width Dark Pill Email Bar */}
        <div className="w-full">
          <motion.div 
            whileHover={{ scale: 1.01, y: -3 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleCopyEmail}
            className="w-full bg-[#121217] text-[#82D8CE] hover:bg-[#1A1A22] rounded-full p-3 sm:p-4 pl-6 sm:pl-10 flex items-center justify-between shadow-2xl transition-colors duration-300 group cursor-target border border-black/30 transform-gpu"
          >
            <div className="flex flex-col truncate pr-4">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#6AC4B9]">
                {copied ? 'COPIED TO CLIPBOARD!' : 'START A CONVERSATION'}
              </span>
              <span className="font-heading font-bold text-lg sm:text-2xl md:text-3xl text-white tracking-tight truncate group-hover:text-[#82D8CE] transition-colors">
                {email}
              </span>
            </div>

            {/* Right Action Circle */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#82D8CE] text-[#121217] flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-white transition-all shadow-md">
              {copied ? <Check size={22} className="text-[#121217]" /> : <ArrowUpRight size={26} className="text-[#121217]" />}
            </div>
          </motion.div>

          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#2C625B] mt-3 px-4">
            <span>CLICK BAR TO COPY ADDRESS</span>
            <a href={`mailto:${email}`} className="underline hover:text-[#121217] transition-colors cursor-target font-semibold">
              OPEN EMAIL CLIENT ↗
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Footer Line (Screenshot 4 Match) */}
      <footer className="w-full flex items-center justify-between border-t border-[#6AC4B9] pt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#2C625B] z-10">
        <span>4RK4N.DEV</span>
        <span className="hidden sm:inline">DIGITAL EXPERIENCES</span>
        <button 
          onClick={() => scrollTo('#home')} 
          className="hover:text-[#121217] transition-colors cursor-target flex items-center gap-1 font-bold"
        >
          <span>BACK TO TOP</span>
          <span>↑</span>
        </button>
      </footer>
    </section>
  )
}
