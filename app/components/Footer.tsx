'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, ArrowUp } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { Profile } from '@prisma/client'

interface FooterProps {
  profile?: Profile | null;
}

const Footer = ({ profile }: FooterProps) => {
  const pathname = usePathname()

  if (pathname.startsWith('/admin') || pathname === '/') {
    return null;
  }

  const email = profile?.email || 'muhammadarkanmariadi@gmail.com'

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="w-full bg-[#EBEBEF] text-[#121217] border-t border-[#D8D8E0] select-none">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        
        {/* Left Column: Brand & Bio */}
        <div className="space-y-4">
          <Link href="/" className="font-bold flex items-center gap-2.5 group cursor-target text-[#121217]">
            <span className="w-7 h-7 rounded border border-[#121217] flex items-center justify-center text-[10px] font-black group-hover:bg-[#121217] group-hover:text-white transition-colors">
              4R
            </span>
            <span className="font-extrabold tracking-wider text-sm">4RK4N.DEV</span>
          </Link>
          
          <p className="text-sm font-sans text-[#555566] max-w-sm leading-relaxed">
            Muhammad Arkan Mariadi — Full-Stack Software Engineer building high-performance production web systems.
          </p>

          <p className="font-mono text-xs text-[#707080] tracking-wider pt-2">
            © {new Date().getFullYear()} 4RK4N.DEV · ALL RIGHTS RESERVED
          </p>
        </div>

        {/* Right Column: Contact, Socials & Back to top */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-12 font-mono text-xs uppercase tracking-wider">
          
          <div className="space-y-2 text-[#555566]">
            <span className="text-[10px] text-[#707080] tracking-[0.2em] block font-bold">DIRECT INQUIRY</span>
            <a 
              href={`mailto:${email}`} 
              className="text-[#121217] font-bold hover:underline flex items-center gap-1 cursor-target"
            >
              <span>{email}</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-[#707080] tracking-[0.2em] block font-bold">CONNECT</span>
            <div className="flex items-center gap-4 text-[#121217] font-bold">
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#707080] transition-colors flex items-center gap-0.5 cursor-target">
                  <span>GITHUB</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#707080] transition-colors flex items-center gap-0.5 cursor-target">
                  <span>LINKEDIN</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
              {profile?.instagramUrl && (
                <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#707080] transition-colors flex items-center gap-0.5 cursor-target">
                  <span>INSTAGRAM</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>

          <button 
            onClick={scrollToTop}
            className="px-4 py-2 rounded-full border border-[#D5D5DF] bg-white text-[#121217] font-bold hover:border-[#121217] transition-all flex items-center gap-1.5 cursor-target shadow-xs"
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
