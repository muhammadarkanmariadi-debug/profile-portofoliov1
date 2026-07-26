'use client'
import React from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Download, Github, Linkedin, Instagram, Twitter } from 'lucide-react'
import ScrambleText from './ScrambleText'
import { useLanguage } from '../providers'
import type { Profile } from '@prisma/client'

const Lanyard = dynamic(() => import('@/components/lanyard'), { ssr: false })

interface HeroProps {
  profile: Profile;
}

const Hero = ({ profile }: HeroProps) => {
  const { t, lang } = useLanguage()

  return (
    <div className='flex flex-col lg:flex-row justify-between items-center gap-16 mx-6 md:mx-10 xl:mx-auto max-w-7xl min-h-[90vh] pt-32 pb-10 overflow-hidden' id='hero'>

      {/* Left Content */}
      <div className='z-10 relative flex flex-col justify-center items-center lg:items-start gap-6 text-center lg:text-left w-full lg:w-1/2'>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/30 bg-secondary/10 text-secondary font-mono text-xs uppercase cursor-target"
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          {t.hero.available}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col gap-2"
        >
          <h1 className='font-bold text-on-surface text-5xl md:text-6xl tracking-tight leading-tight mt-2'>
            {t.hero.titleStart} <br /> <ScrambleText text="ARKAN MARIADI" className="text-primary text-glow" />
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='text-on-surface-variant text-lg font-sans max-w-xl leading-relaxed mt-2'
        >
          {lang === 'id' ? profile.shortDescriptionId : profile.shortDescriptionEn}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4"
        >
          <Link href="#work" className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-mono text-sm uppercase font-bold tracking-widest hover:shadow-[0_0_30px_rgba(108,99,255,0.3)] transition-all cursor-target">
            {t.hero.viewProjects}
          </Link>
          <Link href="/contact" className="flex items-center justify-center gap-2 px-8 py-4 border border-border hover:border-primary/50 text-on-surface rounded-xl font-mono text-sm uppercase font-bold tracking-widest transition-all cursor-target">
            {t.hero.getInTouch}
          </Link>
          {profile.cvFileUrl && (
            <a href={profile.cvFileUrl} target="_blank" rel="noopener noreferrer" download="CV.pdf" className="flex items-center justify-center gap-2 px-8 py-4 border border-border hover:border-primary/50 text-on-surface rounded-xl font-mono text-sm uppercase font-bold tracking-widest transition-all cursor-target">
              <Download size={18} /> CV
            </a>
          )}
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-6 mt-12"
        >
          <span className="text-on-surface-variant font-mono text-sm">{t.hero.availableOn}</span>
          <div className="flex items-center gap-4">
            {profile.githubUrl && (
              <Link href={profile.githubUrl} target="_blank" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg border border-border">
                <Github size={18} />
              </Link>
            )}
            {profile.linkedinUrl && (
              <Link href={profile.linkedinUrl} target="_blank" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg border border-border">
                <Linkedin size={18} />
              </Link>
            )}
            {profile.instagramUrl && (
              <Link href={profile.instagramUrl} target="_blank" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg border border-border">
                <Instagram size={18} />
              </Link>
            )}
            {profile.twitterUrl && (
              <Link href={profile.twitterUrl} target="_blank" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg border border-border">
                <Twitter size={18} />
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* Right Visual (Lanyard) */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className='w-full lg:w-1/2 flex justify-center items-center h-[50vh] xl:h-[80vh] relative'
      >
        {/* Abstract Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-primary/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>
        <div className="z-10 w-full h-full flex items-center justify-center">
          <React.Suspense fallback={
            <div className="flex flex-col items-center justify-center gap-4 text-primary font-mono animate-pulse">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <span>{t.hero.loading3d}</span>
            </div>
          }>
            <Lanyard position={[0, 0, 20]} />
          </React.Suspense>
        </div>
      </motion.div>
    </div>
  )
}

export default Hero
