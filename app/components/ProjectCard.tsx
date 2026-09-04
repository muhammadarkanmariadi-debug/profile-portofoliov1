'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Skill } from '@prisma/client'
import { usePathname } from 'next/navigation'

interface ProjectCardProps {
  id: string
  slug?: string | null
  index?: string
  title: string
  description: string
  role?: string | null
  liveUrl?: string | null
  imageUrl: string | null
  category: string
  techStack?: Skill[]
  colorTheme?: string
  onReadMore?: () => void
}

const themeColors = [
  'bg-[#9CC5D8]', // Ice blue
  'bg-[#C4B7E5]', // Soft purple
  'bg-[#8FD3BE]', // Sage mint
  'bg-[#D8B4A6]', // Muted terra
  'bg-[#A3C4BC]'  // Cool teal
]


export default function ProjectCard({
  id,
  slug,
  index = '01',
  title,
  description,
  liveUrl,
  imageUrl,
  techStack,
  colorTheme,
  onReadMore
}: ProjectCardProps) {
  const displayDomain = liveUrl ? liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : '4rkan.dev/project'
  const bgClass = colorTheme || themeColors[parseInt(index, 10) % themeColors.length] || 'bg-[#9CC5D8]'
  const projectHref = `/projects/${slug || id}`
  const pathname = usePathname()
  return (
    <article className="w-full text-text-primary pt-12 pb-20 border-b border-border">

      {/* Topline: Index + Domain */}
      <div className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-6">
        <span>{index}</span>
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-target"
          >
            <span>{displayDomain}</span>
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>

      {/* Heading: Big Title (Left) + Summary (Right) */}
      <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <Link href={projectHref} className="group/title">
          <h3 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-text-primary group-hover/title:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="max-w-md text-text-muted text-sm sm:text-base font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Desktop Browser Mockup in Colored Frame */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full"
      >
        <Link
          href={projectHref}
          className={`block w-full ${bgClass} rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 cursor-target group relative overflow-hidden transform-gpu shadow-lg hover:shadow-2xl transition-shadow duration-500`}
        >
          {/* Desktop Browser Window */}
          <div className="w-full bg-[#16181D] rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-white/10">

            {/* Browser Bar */}
            <div className="w-full bg-[#111216] px-4 py-3 flex items-center justify-between border-b border-white/10">
              {/* 3 Window Control Dots */}
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></span>
              </div>

              {/* Address Bar */}
              <div className="px-4 py-1 rounded-full bg-[#1C1F26] border border-white/10 text-[11px] font-mono text-[#8E8E9F] max-w-[240px] truncate text-center">
                {displayDomain}
              </div>

              <div className="w-8"></div>
            </div>

            {/* Desktop Screenshot Preview */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0D0E11]">
              <motion.img
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                src={imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
                alt={`${title} desktop browser screenshot`}
                className="w-full h-full object-cover object-top will-change-transform transform-gpu"
                loading="lazy"
              />

              {/* Floating Action Button on Hover */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D0E11]/90 text-white font-mono text-xs uppercase tracking-wider font-bold backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-105 transition-transform">
                  <span>View case study</span>
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </div>

          </div>
        </Link>
      </motion.div>

      {/* Scope Deliverables Footer */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2 text-text-muted">
          <span className="uppercase text-text-primary font-bold">Scope:</span>
          {techStack && techStack.length > 0 ? (
            <span>{techStack.map(s => s.title).join(' · ')}</span>
          ) : (
            <span>Web Architecture · Full-Stack · Real-time API · Cloud Infrastructure</span>
          )}
        </div>

        <Link
          href={projectHref}
          className="text-text-muted hover:text-primary transition-colors uppercase flex items-center gap-1 font-bold cursor-target"
        >
          <span>EXPLORE ARCHITECTURE</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

    </article>
  )
}