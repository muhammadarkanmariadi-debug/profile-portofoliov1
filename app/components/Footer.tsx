'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ArrowUp } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { Profile } from '@prisma/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useSmoothScroll } from '../providers/SmoothScrollProvider'

gsap.registerPlugin(ScrollTrigger)

interface FooterProps {
  profile?: Profile | null;
}

const Footer = ({ profile }: FooterProps) => {
  const pathname = usePathname()
  const footerRef = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()

  useGSAP(() => {
    if (!footerRef.current) return

    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, { scope: footerRef, dependencies: [pathname] })

  if (pathname.startsWith('/admin') || pathname === '/') {
    return null;
  }

  const email = profile?.email || 'muhammadarkanmariadi@gmail.com'

  const handleScrollToTop = () => {
    scrollTo(0, { duration: 1.2 })
  }

  return (
    <footer
      ref={footerRef}
      className="w-full bg-background text-text-primary border-t border-border select-none transition-colors duration-300"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        
        {/* Left Column: Brand & Bio */}
        <div className="space-y-4">
          <Link href="/" className="font-bold flex items-center gap-2.5 group cursor-target text-text-primary">
            <span className="w-7 h-7 rounded border border-border flex items-center justify-center text-[10px] font-black group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-all">
              4R
            </span>
            <span className="font-extrabold tracking-wider text-sm group-hover:text-primary transition-colors">4RK4N.DEV</span>
          </Link>
          
          <p className="text-sm font-sans text-text-muted max-w-sm leading-relaxed">
            Muhammad Arkan Mariadi — Full-Stack Software Engineer building high-performance production web systems.
          </p>

          <p className="font-mono text-xs text-text-muted tracking-wider pt-2">
            © {new Date().getFullYear()} 4RK4N.DEV · ALL RIGHTS RESERVED
          </p>
        </div>

        {/* Right Column: Contact, Socials & Back to top */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-12 font-mono text-xs uppercase tracking-wider">
          
          <div className="space-y-2 text-text-muted">
            <span className="text-[10px] text-text-muted tracking-[0.2em] block font-bold">DIRECT INQUIRY</span>
            <a 
              href={`mailto:${email}`} 
              className="text-text-primary font-bold hover:text-primary transition-colors flex items-center gap-1 cursor-target"
            >
              <span>{email}</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-text-muted tracking-[0.2em] block font-bold">CONNECT</span>
            <div className="flex items-center gap-4 text-text-primary font-bold">
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-0.5 cursor-target">
                  <span>GITHUB</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-0.5 cursor-target">
                  <span>LINKEDIN</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
              {profile?.instagramUrl && (
                <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-0.5 cursor-target">
                  <span>INSTAGRAM</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>

          <button 
            onClick={handleScrollToTop}
            className="px-4 py-2 rounded-full border border-border bg-surface text-text-primary font-bold hover:border-primary/50 hover:bg-surface-elevated transition-all flex items-center gap-1.5 cursor-target shadow-xs"
          >
            <span>TOP</span>
            <ArrowUp size={13} />
          </button>

        </div>

      </div>
    </footer>
  )
}

export default Footer

