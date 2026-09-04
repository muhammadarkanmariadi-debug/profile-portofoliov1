'use client'
import React, { useState, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { 
  ArrowUpRight, 
  Check, 
  Copy, 
  Mail, 
  Github, 
  Linkedin, 
  FileText,
  Globe,
  Clock
} from 'lucide-react'
import { useSmoothScroll } from '../providers/SmoothScrollProvider'
import type { Profile } from '@prisma/client'

gsap.registerPlugin(ScrollTrigger)

interface ContactCTAProps {
  profile?: Profile | null;
}

export default function ContactCTA({ profile }: ContactCTAProps) {
  const [copied, setCopied] = useState(false)
  const { scrollTo } = useSmoothScroll()
  const sectionRef = useRef<HTMLElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)
  const emailBarRef = useRef<HTMLDivElement>(null)

  const email = profile?.email || 'muhammadarkanmariadi@gmail.com'
  const github = profile?.githubUrl || 'https://github.com/MuhammadArkanMariadi'
  const linkedin = profile?.linkedinUrl || 'https://linkedin.com/in/muhammadarkanmariadi'

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  useGSAP(() => {
    if (!sectionRef.current) return

    // Watermark parallax scrub
    if (watermarkRef.current) {
      gsap.fromTo(watermarkRef.current,
        { yPercent: 15, opacity: 0.02 },
        {
          yPercent: -15,
          opacity: 0.07,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      )
    }

    // Magnetic Pill Interaction
    const el = emailBarRef.current
    if (!el) return

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * 0.18
      const deltaY = (e.clientY - centerY) * 0.25
      xTo(deltaX)
      yTo(deltaY)
    }

    const handleMouseLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener("mousemove", handleMouseMove)
    el.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      el.removeEventListener("mousemove", handleMouseMove)
      el.removeEventListener("mouseleave", handleMouseLeave)
    }

  }, { scope: sectionRef })

  return (
    <section 
      id="contact"
      ref={sectionRef}
      className="relative z-20 w-full min-h-screen bg-[#82D8CE] text-[#121217] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden shadow-[0_-25px_60px_rgba(0,0,0,0.3)] border-t border-[#6AC4B9]"
    >
      {/* Background Watermark 05 */}
      <div 
        ref={watermarkRef}
        className="absolute right-0 bottom-10 font-heading font-black text-[28vw] leading-none text-[#121217] pointer-events-none z-0 select-none will-change-transform"
      >
        05
      </div>

      {/* Top Section Header with Index */}
      <header className="w-full flex items-center justify-between border-b border-[#6AC4B9] pb-4 font-mono text-xs uppercase tracking-[0.2em] text-[#2C625B] z-10">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#121217]">05</span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#121217] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#121217]" />
            </span>
            <span>AVAILABLE FOR WORK</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 sm:gap-8 text-[11px] sm:text-xs">
          <Link href="#work" className="hover:text-[#121217] transition-colors cursor-target">WORK</Link>
          <Link href="#about" className="hover:text-[#121217] transition-colors cursor-target">ABOUT</Link>
          <Link href="#skills" className="hover:text-[#121217] transition-colors cursor-target">SKILLS</Link>
          <Link href="#achievements" className="hidden md:inline-block hover:text-[#121217] transition-colors cursor-target">CREDENTIALS</Link>
          <Link href="#contact" className="hover:text-[#121217] font-bold text-[#121217] transition-colors cursor-target">CONTACT</Link>
        </div>
      </header>

      {/* Center Body: Massive Extrabold WANT TO CONNECT Heading + Interactive Hub */}
      <div className="w-full max-w-[1300px] mx-auto my-auto py-12 sm:py-20 z-10">
        
        {/* Massive Extrabold Heading */}
        <div className="mb-8 sm:mb-12">
          <div className="overflow-hidden">
            <h2 className="font-heading font-black text-5xl sm:text-7xl md:text-8xl lg:text-[8vw] tracking-tighter leading-[0.88] uppercase text-[#121217] select-none">
              WANT TO
            </h2>
          </div>
          <div className="overflow-hidden mt-1 sm:mt-2">
            <h2 className="font-heading font-black text-5xl sm:text-7xl md:text-8xl lg:text-[8vw] tracking-tighter leading-[0.88] uppercase text-[#121217] inline-flex items-center select-none">
              <span>CONNECT</span>
              <span 
                className="text-transparent ml-2 sm:ml-4 inline-block"
                style={{ WebkitTextStroke: '2.5px #121217' }}
              >
                ?
              </span>
            </h2>
          </div>
        </div>

        {/* Editorial Sub-statement & Metadata Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-end border-t border-[#6AC4B9] pt-8">
          <div className="lg:col-span-7">
            <p className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-[#121217] tracking-tight leading-snug">
              Let&#39;s make something impossible to ignore.
            </p>
            <p className="font-sans text-sm sm:text-base text-[#2C625B] leading-relaxed mt-2.5 max-w-xl font-medium">
              Open for full-stack engineering roles, high-concurrency systems development, and digital architecture consultations.
            </p>
          </div>

          {/* Quick Location / Timezone Chips */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 font-mono text-xs uppercase">
            <div className="p-3.5 rounded-2xl bg-[#71CCBF]/50 border border-[#5EBFA0] flex flex-col justify-between">
              <span className="text-[#2C625B] flex items-center gap-1 text-[11px] font-bold">
                <Globe size={13} />
                <span>LOCATION</span>
              </span>
              <span className="font-bold text-[#121217] mt-1.5">MALANG, ID</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#71CCBF]/50 border border-[#5EBFA0] flex flex-col justify-between">
              <span className="text-[#2C625B] flex items-center gap-1 text-[11px] font-bold">
                <Clock size={13} />
                <span>TIMEZONE</span>
              </span>
              <span className="font-bold text-[#121217] mt-1.5">WIB (UTC+7)</span>
            </div>
          </div>
        </div>

        {/* Full-width Dark Pill Email Bar with Magnetic Physics */}
        <div className="w-full">
          <div 
            ref={emailBarRef}
            onClick={handleCopyEmail}
            className="w-full bg-[#121217] text-[#82D8CE] hover:bg-[#1A1A22] rounded-3xl sm:rounded-full p-4 sm:p-5 pl-6 sm:pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl transition-colors duration-300 group cursor-target border border-black/30 transform-gpu will-change-transform select-none"
          >
            <div className="flex flex-col truncate pr-4">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#6AC4B9] font-bold">
                {copied ? 'COPIED TO CLIPBOARD!' : 'CLICK BAR TO COPY DIRECT EMAIL'}
              </span>
              <span className="font-heading font-extrabold text-xl sm:text-3xl md:text-4xl text-white tracking-tight truncate group-hover:text-[#82D8CE] transition-colors mt-1">
                {email}
              </span>
            </div>

            {/* Right Action Circle */}
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center font-mono text-xs uppercase tracking-wider text-white/70 group-hover:text-white transition-colors font-bold">
                {copied ? 'COPIED' : 'COPY'}
              </span>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#82D8CE] text-[#121217] flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-white transition-all shadow-md">
                {copied ? <Check size={24} className="stroke-[3]" /> : <Copy size={22} />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#2C625B] mt-3 px-4 font-bold">
            <span>COPY EMAIL ADDRESS</span>
            <a href={`mailto:${email}`} className="underline hover:text-[#121217] transition-colors cursor-target">
              OPEN EMAIL CLIENT ↗
            </a>
          </div>
        </div>

        {/* Quick Social & Inquiry Channels */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <a
            href={`mailto:${email}`}
            className="p-3.5 sm:p-4 rounded-2xl bg-[#71CCBF]/40 border border-[#5EBFA0] hover:bg-[#121217] hover:text-[#82D8CE] transition-all flex items-center justify-between group cursor-target shadow-sm hover:-translate-y-0.5 duration-200"
          >
            <div className="flex items-center gap-2.5">
              <Mail size={16} />
              <span className="font-heading font-bold text-xs sm:text-sm">Email</span>
            </div>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 sm:p-4 rounded-2xl bg-[#71CCBF]/40 border border-[#5EBFA0] hover:bg-[#121217] hover:text-[#82D8CE] transition-all flex items-center justify-between group cursor-target shadow-sm hover:-translate-y-0.5 duration-200"
          >
            <div className="flex items-center gap-2.5">
              <Github size={16} />
              <span className="font-heading font-bold text-xs sm:text-sm">GitHub</span>
            </div>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 sm:p-4 rounded-2xl bg-[#71CCBF]/40 border border-[#5EBFA0] hover:bg-[#121217] hover:text-[#82D8CE] transition-all flex items-center justify-between group cursor-target shadow-sm hover:-translate-y-0.5 duration-200"
          >
            <div className="flex items-center gap-2.5">
              <Linkedin size={16} />
              <span className="font-heading font-bold text-xs sm:text-sm">LinkedIn</span>
            </div>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <Link
            href="/contact"
            className="p-3.5 sm:p-4 rounded-2xl bg-[#71CCBF]/40 border border-[#5EBFA0] hover:bg-[#121217] hover:text-[#82D8CE] transition-all flex items-center justify-between group cursor-target shadow-sm hover:-translate-y-0.5 duration-200"
          >
            <div className="flex items-center gap-2.5">
              <FileText size={16} />
              <span className="font-heading font-bold text-xs sm:text-sm">Send Inquiry</span>
            </div>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Bottom Footer Line */}
      <footer className="w-full flex items-center justify-between border-t border-[#6AC4B9] pt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#2C625B] z-10">
        <span>4RK4N.DEV</span>
        <span className="hidden sm:inline font-bold">DIGITAL EXPERIENCES</span>
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
