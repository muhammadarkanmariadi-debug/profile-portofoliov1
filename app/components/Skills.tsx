'use client'
import React, { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import { useLanguage } from '../providers'
import type { Skill } from '@prisma/client'

gsap.registerPlugin(ScrollTrigger, Flip)

import type { DynamicCloudProps } from '@/components/ui/interactive-icon-cloud'

const IconCloud = dynamic<DynamicCloudProps>(
  () => import('@/components/ui/interactive-icon-cloud').then((mod) => mod.IconCloud),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] flex items-center justify-center text-text-muted font-mono text-xs">
        LOADING ORBIT...
      </div>
    )
  }
)

const ARKAN_TECH_SLUGS = [
  // Core Frontend & Mobile
  "nextdotjs",
  "react",
  "typescript",
  "javascript",
  "tailwindcss",
  "flutter",
  "bootstrap",
  "html5",
  "css3",

  // Backend & APIs
  "nestjs",
  "laravel",
  "nodedotjs",
  "express",
  "fastapi",
  "go",
  "php",
  "python",
  "openjdk",

  // Database, ORM & Caching
  "postgresql",
  "mysql",
  "mariadb",
  "prisma",
  "redis",

  // DevOps, Cloud & Tools
  "docker",
  "git",
  "github",
  "postman",
  "amazonaws",
  "linux",
  "ubuntu",
  "debian",
  "linuxmint",
  "figma",
  "visualstudiocode",

  // Motion & 3D WebGL
  "threedotjs",
  "greensock"
]

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  // Dynamically derive SimpleIcons slugs from the database skills
  const dynamicIconSlugs = React.useMemo(() => {
    if (!skills || skills.length === 0) return ARKAN_TECH_SLUGS;

    const SLUG_MAP: Record<string, string | string[]> = {
      'next.js': 'nextdotjs',
      'nextjs': 'nextdotjs',
      'node.js': 'nodedotjs',
      'nodejs': 'nodedotjs',
      'vue.js': 'vuedotjs',
      'vuejs': 'vuedotjs',
      'react': 'react',
      'react.js': 'react',
      'react native': 'react',
      'tailwind css': 'tailwindcss',
      'tailwindcss': 'tailwindcss',
      'prisma orm': 'prisma',
      'prisma': 'prisma',
      'git & github': ['git', 'github'],
      'git': 'git',
      'github': 'github',
      'linux ubuntu': 'ubuntu',
      'ubuntu': 'ubuntu',
      'linux mint': 'linuxmint',
      'linux debian': 'debian',
      'debian': 'debian',
      'c++': 'cplusplus',
      'c#': 'csharp',
      '.net': 'dotnet',
      'golang': 'go',
      'go': 'go',
      'java': 'openjdk',
      'aws': 'amazonaws',
      'amazon web services': 'amazonaws',
      'vs code': 'visualstudiocode',
      'visual studio code': 'visualstudiocode',
      'three.js': 'threedotjs',
      'threejs': 'threedotjs',
      'gsap': 'greensock',
      'bootstrap': 'bootstrap',
      'flutter': 'flutter',
      'fastapi': 'fastapi',
      'nestjs': 'nestjs',
      'nest.js': 'nestjs',
      'laravel': 'laravel',
      'postgresql': 'postgresql',
      'mysql': 'mysql',
      'mariadb': 'mariadb',
      'redis': 'redis',
      'python': 'python',
      'php': 'php',
      'docker': 'docker',
      'figma': 'figma',
      'postman': 'postman',
      'javascript': 'javascript',
      'typescript': 'typescript',
      'html5': 'html5',
      'css3': 'css3',
    };

    const slugsSet = new Set<string>();

    for (const skill of skills) {
      const lower = skill.title.toLowerCase().trim();
      const mapped = SLUG_MAP[lower];
      if (mapped) {
        if (Array.isArray(mapped)) {
          mapped.forEach((s) => slugsSet.add(s));
        } else {
          slugsSet.add(mapped);
        }
      } else {
        const clean = lower.replace(/[^a-z0-9]/g, '');
        if (clean) slugsSet.add(clean);
      }
    }

    return Array.from(slugsSet);
  }, [skills]);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const CATEGORY_DISPLAY_MAP: Record<string, string> = {
    FRONTEND: 'FRONTEND',
    BACKEND: 'BACKEND',
    DATABASE_ORM: 'DATABASE & ORM',
    BAHASA_LAINNYA: 'OTHER LANGUAGES',
    VERSION_CONTROL: 'VERSION CONTROL',
    CLOUD_DEPLOYMENT: 'CLOUD & DEPLOYMENT',
    DESIGN_PROTOTYPING: 'DESIGN & PROTOTYPING',
    SISTEM_OPERASI: 'OPERATING SYSTEMS',
  };

  const getCategoryLabel = (cat: string) => CATEGORY_DISPLAY_MAP[cat] || cat.replace(/_/g, ' ');

  const categories = Object.keys(groupedSkills).sort();
  const [activeTab, setActiveTab] = useState(categories.length > 0 ? categories[0] : 'FRONTEND')

  const gridRef = useRef<HTMLDivElement>(null)
  const headerMetaRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    if (headerMetaRef.current) {
      tl.fromTo(
        headerMetaRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
    }

    if (headingRef.current) {
      tl.fromTo(
        headingRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.3'
      )
    }

    // Velocity-reactive ambient marquee scrub with Lenis scroll
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        xPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.0
        }
      })
    }
  }, { scope: sectionRef })

  // Stagger grid cards when category changes
  useGSAP(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.skill-card')
    gsap.fromTo(cards,
      { opacity: 0, y: 20, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        stagger: 0.035,
        ease: 'back.out(1.6)',
        clearProps: 'transform'
      }
    )
  }, { dependencies: [activeTab], scope: sectionRef })

  if (categories.length === 0) return null;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="inverted-theme w-full bg-background text-text-primary py-20 sm:py-24 px-5 sm:px-8 md:px-10 border-b border-border transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Section Header with Index */}
        <header className="w-full border-b border-border pb-8 sm:pb-12 mb-10 sm:mb-16">
          <div ref={headerMetaRef} className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-6 sm:mb-10">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              <span>TECHNICAL ARCHITECTURE</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bold text-primary">03</span>
              <span className="hidden sm:inline-block font-bold">STACK INDEX</span>
            </div>
          </div>

          {/* Big Massive Title with Mask Slide-Up Entry */}
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[7.2vw] tracking-tighter leading-[0.88] uppercase text-text-primary select-none will-change-transform"
            >
              TECHNICAL<br />
              SKILLS
            </h2>
          </div>
        </header>

        {/* Ambient Velocity Tech Tape */}
        <div className="w-full overflow-hidden mb-10 sm:mb-12 py-3 border-y border-border/60 font-mono text-xs uppercase tracking-widest text-text-muted select-none">
          <div ref={marqueeRef} className="flex gap-8 whitespace-nowrap will-change-transform">
            {skills.concat(skills).map((skill, idx) => (
              <span key={`ticker-${skill.id}-${idx}`} className="flex items-center gap-3">
                <span className="text-primary font-bold">·</span>
                <span className="font-semibold text-text-primary">{skill.title}</span>
                <span className="text-[10px] text-text-muted">({getCategoryLabel(skill.category)})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Dual-Panel Layout: Category Tabs & Skills Grid + 3D Interactive Tech Orbit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left / Main Section: Category Filter & Grid */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 sm:gap-8">

            {/* Category Tabs with spring indicator */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => {
                const isActive = activeTab === category
                return (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`relative px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-target font-bold z-10 ${isActive ? 'text-background' : 'text-text-muted hover:text-text-primary'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        className="absolute inset-0 bg-primary rounded-full -z-10 shadow-lg"
                      />
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-surface border border-border rounded-full -z-20 hover:border-primary/40 transition-colors" />
                    )}
                    <span>{getCategoryLabel(category)}</span>
                  </button>
                )
              })}
            </div>

            {/* Active Category Skills Grid with GSAP Stagger */}
            <div
              ref={gridRef}
              className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
            >
              {groupedSkills[activeTab]?.sort((a, b) => a.order - b.order).map((skill) => (
                <div
                  key={skill.id}
                  className="skill-card p-4 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-2.5 sm:gap-3 bg-surface border border-border hover:border-primary/60 hover:bg-surface-elevated transition-all duration-200 cursor-target group transform-gpu shadow-sm hover:-translate-y-1 hover:scale-[1.02]"
                >
                  {skill.logoUrl ? (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center relative">
                      <img
                        src={skill.logoUrl}
                        alt={skill.title}
                        className="max-w-full max-h-full object-contain filter group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.4)] transition-all duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-surface-elevated flex items-center justify-center font-mono font-bold text-sm sm:text-base text-primary border border-border">
                      {skill.title.charAt(0)}
                    </div>
                  )}

                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-center text-text-primary group-hover:text-primary font-bold transition-colors">
                    {skill.title}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Section: Seamless Clean Interactive 3D Tech Orbit */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center justify-center w-full">
            <div className="sticky top-28 w-full max-w-[340px] sm:max-w-[400px] lg:max-w-none flex items-center justify-center overflow-visible py-2 sm:py-6 mx-auto">
              <IconCloud iconSlugs={dynamicIconSlugs} />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}