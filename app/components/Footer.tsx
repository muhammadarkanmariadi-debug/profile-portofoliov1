'use client'
import React from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useLanguage } from '../providers'
import type { Profile } from '@prisma/client'
import { usePathname } from 'next/navigation'

interface FooterProps {
  profile: Profile;
}

const Footer = ({ profile }: FooterProps) => {
  const { t } = useLanguage()
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full bg-[#111111]  mt-auto">
      <div className="max-w-[1200px] mx-auto px-8 py-20 flex flex-col md:flex-row justify-between relative overflow-hidden">
        
        {/* Left Column - Contact Info */}
        <div className="flex flex-col z-10 md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-sans cursor-target">
            {t.footer.title}
          </h2>
          <p className="text-gray-400 text-sm mb-12 font-sans cursor-target">
            {t.footer.desc}
          </p>

          <div className="flex flex-col space-y-8">
            {/* Phone */}
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-white group-hover:border-white transition-colors">
                <Phone size={20} />
              </div>
              <div className="flex flex-col cursor-target">
                <span className="text-gray-400 text-sm font-sans mb-1">{t.contact.phone}</span>
                <span className="text-white font-medium font-sans">{profile.phone || '+62-xxx-xxxx'}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-white group-hover:border-white transition-colors">
                <Mail size={20} />
              </div>
              <div className="flex flex-col cursor-target">
                <span className="text-gray-400 text-sm font-sans mb-1">{t.contact.email}</span>
                <span className="text-white font-medium font-sans break-all ">{profile.email || 'email@example.com'}</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-white group-hover:border-white transition-colors">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col cursor-target">
                <span className="text-gray-400 text-sm font-sans mb-1">{t.contact.location}</span>
                <span className="text-white font-medium font-sans leading-relaxed">
                  {profile.address || 'Indonesia'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Abstract Art */}
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none">
          <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-80">
            {/* Wavy line */}
            <path d="M450 50 C350 50, 450 250, 380 260 C350 265, 330 230, 290 250 C250 270, 220 350, 210 380" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            
            {/* Second Wavy line (fainter/offset) */}
            <path d="M480 30 C380 30, 480 230, 410 240 C380 245, 360 210, 320 230 C280 250, 250 330, 240 360" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" fill="none" />
            
            {/* Circle */}
            <circle cx="340" cy="270" r="10" stroke="white" strokeWidth="1.5" fill="none" />
            
            {/* Triangles */}
            <polygon points="250,90 270,110 250,110" stroke="white" strokeWidth="1.5" fill="none" />
            <polygon points="280,120 300,140 260,150" stroke="#8A2BE2" strokeWidth="2" fill="none" />
          </svg>
        </div>
        
      </div>
    </footer>
  )
}

export default Footer
