'use client'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { ArrowDown, GraduationCap, Briefcase, Download, MapPin, Mail, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../providers'
import type { Profile, TimelineEntry } from '@prisma/client'

gsap.registerPlugin(ScrollTrigger)

interface AboutmeProps {
  profile?: Profile | null;
  timeline?: TimelineEntry[];
}

export default function Aboutme({ profile, timeline = [] }: AboutmeProps) {
  const { lang } = useLanguage()
  const containerRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLHeadingElement>(null)
  const bioCardRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Dynamic short statement from backend Profile
  const shortBio = profile?.shortDescription || 
    "Muhammad Arkan blends full-stack software engineering with cutting-edge digital architecture."

  const secondaryBio = "We shape high-performance production web systems through each project we design and ship."

  const words1 = shortBio.split(' ')
  const words2 = secondaryBio.split(' ')

  useGSAP(() => {
    if (!containerRef.current || !statementRef.current) return

    const words = statementRef.current.querySelectorAll('.kinetic-word')

    // Silky progressive word illumination scrub on natural scroll
    if (words && words.length > 0) {
      gsap.fromTo(
        words,
        { opacity: 0.18, y: 6, filter: 'blur(3px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statementRef.current,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: 1.0,
          },
        }
      )
    }

    // Bio Card entrance on scroll
    if (bioCardRef.current) {
      gsap.fromTo(
        bioCardRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bioCardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }

    // Timeline items staggered entrance
    if (timelineRef.current) {
      const items = timelineRef.current.querySelectorAll('.timeline-item')
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -16 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }
  }, { scope: containerRef, dependencies: [shortBio, secondaryBio] })

  // Full biography paragraphs from backend Profile
  const fullBiography = profile?.fullBiography || 
    "I am a Full-Stack Software Engineer currently studying at SMK Telkom Malang. I specialize in designing and shipping production-grade web systems, high-concurrency event platforms, and robust database architectures using Next.js, React, Nest.js, and Laravel."

  const biographyParagraphs = fullBiography.split('\n\n')

  const educationEntries = timeline.filter(item => item.type === 'EDUCATION')
  const experienceEntries = timeline.filter(item => item.type === 'EXPERIENCE')

  return (
    <section 
      id="about"
      ref={containerRef}
      className="relative w-full min-h-screen bg-background text-text-primary flex flex-col justify-between p-5 sm:p-8 md:p-10 select-none border-b border-border transition-colors duration-300"
    >
      {/* Top Section Header with Index */}
      <header className="w-full flex items-center justify-between border-b border-border pb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-4">
          <span className="font-bold text-primary">01</span>
          <span>ABOUT 4RK4N.DEV</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 sm:gap-8 text-[11px] sm:text-xs">
          <Link href="#work" className="hover:text-text-primary hover:text-primary transition-colors cursor-target">WORK</Link>
          <Link href="#about" className="hover:text-text-primary text-text-primary font-bold border-b border-primary pb-0.5 transition-colors cursor-target">ABOUT</Link>
          <Link href="#skills" className="hover:text-text-primary hover:text-primary transition-colors cursor-target">SKILLS</Link>
          <Link href="#approach" className="hover:text-text-primary hover:text-primary transition-colors cursor-target">APPROACH</Link>
          <Link href="#achievements" className="hidden md:inline-block hover:text-text-primary hover:text-primary transition-colors cursor-target">CREDENTIALS</Link>
          <Link href="#contact" className="hover:text-text-primary hover:text-primary transition-colors cursor-target">CONTACT</Link>
        </div>
      </header>

      {/* Kinetic Statement Centerpiece */}
      <div className="max-w-[1250px] mx-auto my-auto py-12 sm:py-16 md:py-20 w-full">
        
        {/* Kinetic Header Words */}
        <h2 ref={statementRef} className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-[3.2vw] tracking-tight leading-[1.16] text-text-primary mb-8 sm:mb-12">
          {/* First Sentence */}
          <div className="mb-4 sm:mb-6 flex flex-wrap">
            {words1.map((word, i) => (
              <span 
                key={`s1-${i}`} 
                className="kinetic-word inline-block mr-[0.3em] text-text-primary will-change-transform will-change-[filter]"
              >
                {word}
              </span>
            ))}
          </div>

          {/* Second Sentence */}
          <div className="flex flex-wrap">
            {words2.map((word, i) => (
              <span 
                key={`s2-${i}`} 
                className="kinetic-word inline-block mr-[0.3em] text-text-primary will-change-transform will-change-[filter]"
              >
                {word}
              </span>
            ))}
          </div>
        </h2>

        {/* Detailed Biography & Metadata from Backend Profile */}
        <div ref={bioCardRef} className="mt-8 sm:mt-12 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-surface/80 backdrop-blur-md border border-border shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start will-change-transform">
          <div className="lg:col-span-8 space-y-4 font-sans text-sm sm:text-base text-text-primary leading-relaxed">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-bold block mb-2">
              BIOGRAPHY & ENGINEERING PHILOSOPHY
            </span>
            {biographyParagraphs.map((para, idx) => (
              <p key={idx} className="leading-relaxed text-text-muted">
                {para}
              </p>
            ))}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4 pl-0 lg:pl-6 lg:border-l border-border font-mono text-xs text-text-muted">
            {profile?.address && (
              <div className="flex items-center gap-2 text-text-primary">
                <MapPin size={15} className="text-primary flex-shrink-0" />
                <span>{profile.address}</span>
              </div>
            )}
            {profile?.email && (
              <div className="flex items-center gap-2 text-text-primary">
                <Mail size={15} className="text-primary flex-shrink-0" />
                <a href={`mailto:${profile.email}`} className="hover:underline truncate cursor-target">
                  {profile.email}
                </a>
              </div>
            )}
            
            {profile?.cvFileUrl && (
              <a
                href={profile.cvFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-background font-bold hover:opacity-90 transition-opacity cursor-target shadow-md"
              >
                <Download size={14} />
                <span>DOWNLOAD RESUME / CV</span>
              </a>
            )}

            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border">
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1 cursor-target">
                  <span>GITHUB</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1 cursor-target">
                  <span>LINKEDIN</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Structured Credentials & Timeline */}
        {timeline.length > 0 && (
          <div ref={timelineRef} className="mt-16 pt-10 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Education */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                <GraduationCap size={16} className="text-primary" />
                <span>EDUCATION</span>
              </div>
              <div className="space-y-4 pl-3 border-l border-border">
                {educationEntries.map(item => (
                  <div key={item.id} className="timeline-item p-3 rounded-xl hover:bg-surface/50 transition-colors">
                    <h4 className="font-bold text-base text-text-primary">{item.title}</h4>
                    <p className="text-xs font-mono text-text-muted mt-0.5">{item.category}</p>
                    <p className="text-sm text-text-muted mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                <Briefcase size={16} className="text-primary" />
                <span>EXPERIENCE</span>
              </div>
              <div className="space-y-4 pl-3 border-l border-border">
                {experienceEntries.map(item => (
                  <div key={item.id} className="timeline-item p-3 rounded-xl hover:bg-surface/50 transition-colors">
                    <h4 className="font-bold text-base text-text-primary">{item.title}</h4>
                    <p className="text-xs font-mono text-text-muted mt-0.5">{item.category}</p>
                    <p className="text-sm text-text-muted mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Line & Next Section Jump Arrow */}
      <footer className="w-full flex items-center justify-between border-t border-border pt-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">CAPABILITIES & BACKGROUND</span>
        <Link 
          href="#work" 
          aria-label="Continue to projects"
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-primary hover:text-background hover:border-primary transition-all cursor-target"
        >
          <ArrowDown size={18} />
        </Link>
      </footer>
    </section>
  )
}