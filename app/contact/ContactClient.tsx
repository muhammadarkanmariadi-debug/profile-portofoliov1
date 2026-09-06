'use client'
import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Send, MapPin, Mail, Phone, Sparkles } from 'lucide-react'
import type { Profile } from '@prisma/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface ContactClientProps {
  profile: Profile
}

export default function ContactClient({ profile }: ContactClientProps) {
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const containerRef = useRef<HTMLElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const line1Ref = useRef<HTMLHeadingElement>(null)
  const line2Ref = useRef<HTMLHeadingElement>(null)
  const line3Ref = useRef<HTMLHeadingElement>(null)
  const emailBarRef = useRef<HTMLDivElement>(null)
  const emailSubRef = useRef<HTMLDivElement>(null)
  const metaInfoRef = useRef<HTMLDivElement>(null)
  const formCardRef = useRef<HTMLDivElement>(null)

  const email = profile?.email || 'muhammadarkanmariadi@gmail.com'

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email)
      setCopied(true)

      if (emailBarRef.current) {
        gsap.fromTo(
          emailBarRef.current,
          { scale: 0.98 },
          { scale: 1, duration: 0.4, ease: 'back.out(2)' }
        )
      }

      setTimeout(() => setCopied(false), 2500)
    }
  }

  useGSAP(() => {
    if (!containerRef.current) return

    // 1. Watermark parallax scrub
    if (watermarkRef.current) {
      gsap.fromTo(
        watermarkRef.current,
        { yPercent: 10, opacity: 0.04 },
        {
          yPercent: -20,
          opacity: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          }
        }
      )
    }

    // 2. Entrance Sequence
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (headerRef.current) {
      tl.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
    }

    if (line1Ref.current && line2Ref.current && line3Ref.current) {
      tl.fromTo(
        [line1Ref.current, line2Ref.current, line3Ref.current],
        { yPercent: 110 },
        { yPercent: 0, duration: 0.85, stagger: 0.1, ease: 'power4.out' },
        '-=0.3'
      )
    }

    if (emailBarRef.current) {
      tl.fromTo(
        emailBarRef.current,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.4'
      )
    }

    if (emailSubRef.current) {
      tl.fromTo(emailSubRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
    }

    if (metaInfoRef.current) {
      tl.fromTo(metaInfoRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    }

    if (formCardRef.current) {
      tl.fromTo(
        formCardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
        '-=0.5'
      )
    }

    // 3. Fast, Snappy Magnetic Physics on Email Pill (Desktop fine pointer only)
    const el = emailBarRef.current
    if (el && typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power2.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power2.out' })

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = (e.clientX - centerX) * 0.22
        const deltaY = (e.clientY - centerY) * 0.35
        xTo(deltaX)
        yTo(deltaY)
      }

      const handleMouseLeave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('mousemove', handleMouseMove, { passive: true })
      el.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        el.removeEventListener('mousemove', handleMouseMove)
        el.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, { scope: containerRef })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    const formData = new FormData(form)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      setStatus('success')
      form.reset()
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main
      ref={containerRef}
      className="w-full bg-[#82D8CE] text-[#121217] pt-32 pb-32 min-h-screen px-6 sm:px-10 relative select-none overflow-hidden"
    >
      {/* Background Watermark 05 */}
      <div
        ref={watermarkRef}
        className="absolute right-0 bottom-10 font-heading font-black text-[28vw] leading-none text-[#121217] opacity-[0.06] pointer-events-none z-0 will-change-transform"
      >
        05
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Top Header Index */}
        <header
          ref={headerRef}
          className="mb-16 border-b border-[#6AC4B9] pb-8 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-[#2C625B]"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#121217]">05</span>
            <span>GET IN TOUCH</span>
          </div>
          <span>INITIATE CONTACT</span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Huge Headline & Pill Email */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#2C625B] font-semibold mb-6">
                HAVE A PROJECT OR ROLE IN MIND?
              </p>

              <div className="font-heading font-black text-4xl sm:text-6xl lg:text-[5.5vw] tracking-tighter leading-[0.95] text-[#121217] mb-8 select-none">
                <div className="overflow-hidden">
                  <h1 ref={line1Ref} className="will-change-transform">Let&#39;s make</h1>
                </div>
                <div className="overflow-hidden">
                  <h1 ref={line2Ref} className="will-change-transform">something impossible</h1>
                </div>
                <div className="overflow-hidden">
                  <h1
                    ref={line3Ref}
                    className="text-transparent inline-block will-change-transform"
                    style={{
                      WebkitTextStroke: '2.5px #121217'
                    }}
                  >
                    to ignore.
                  </h1>
                </div>
              </div>
            </div>

            {/* Full-width Dark Pill Email Bar */}
            <div>
              <div
                ref={emailBarRef}
                onClick={handleCopyEmail}
                className={`w-full bg-[#121217] text-[#82D8CE] hover:bg-[#1A1A22] rounded-full p-4 pl-6 sm:pl-8 flex items-center justify-between shadow-2xl transition-[background-color,border-color,box-shadow] duration-200 group cursor-target border ${
                  copied ? 'border-[#00E599] shadow-[0_0_25px_rgba(0,229,153,0.35)]' : 'border-black/30'
                } transform-gpu will-change-transform select-none`}
              >
                <div className="flex flex-col truncate pr-4">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#6AC4B9] font-bold flex items-center gap-1.5">
                    {copied ? (
                      <>
                        <Sparkles size={13} className="text-[#00E599] animate-spin" />
                        <span className="text-[#00E599]">COPIED TO CLIPBOARD!</span>
                      </>
                    ) : (
                      'DIRECT EMAIL ADDRESS'
                    )}
                  </span>
                  <span className="font-heading font-bold text-lg sm:text-2xl text-white tracking-tight truncate group-hover:text-[#82D8CE] transition-colors mt-0.5">
                    {email}
                  </span>
                </div>

                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all shadow-md ${
                  copied ? 'bg-[#00E599] text-[#121217]' : 'bg-[#82D8CE] text-[#121217] group-hover:bg-white'
                }`}>
                  {copied ? <Check size={20} className="text-[#121217] stroke-[3]" /> : <ArrowUpRight size={22} className="text-[#121217]" />}
                </div>
              </div>

              <div ref={emailSubRef} className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#2C625B] mt-3 px-4 font-bold">
                <span>CLICK BAR TO COPY EMAIL</span>
                <a href={`mailto:${email}`} className="underline hover:text-[#121217] transition-colors cursor-target">
                  OPEN IN CLIENT ↗
                </a>
              </div>
            </div>

            {/* Quick Meta Info */}
            <div ref={metaInfoRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#6AC4B9] font-mono text-xs text-[#2C625B]">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#121217]" />
                <div>
                  <span className="font-bold text-[#121217] block">LOCATION</span>
                  <span>{profile.address || 'Malang, East Java, Indonesia'}</span>
                </div>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#121217]" />
                  <div>
                    <span className="font-bold text-[#121217] block">TELEPHONE</span>
                    <span>{profile.phone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Dark Form Card */}
          <div
            ref={formCardRef}
            className="lg:col-span-5 bg-[#121217] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-black/30 transform-gpu will-change-transform"
          >
            <h3 className="font-heading font-bold text-2xl mb-2 text-white">Send a Direct Message</h3>
            <p className="text-xs font-mono text-[#8E8E9F] uppercase tracking-wider mb-8">Direct inquiry inbox</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0B2] mb-2 font-bold">
                  Your Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full bg-[#1A1A24] border border-[#2B2B3A] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#82D8CE] transition-colors font-sans"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0B2] mb-2 font-bold">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-[#1A1A24] border border-[#2B2B3A] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#82D8CE] transition-colors font-sans"
                  placeholder="jane@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0B2] mb-2 font-bold">
                  Message / Project Details
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-[#1A1A24] border border-[#2B2B3A] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#82D8CE] transition-colors resize-none font-sans"
                  placeholder="Tell me about your project, timeline, or inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#82D8CE] text-[#121217] hover:bg-white font-mono text-xs uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2 cursor-target shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>TRANSMITTING MESSAGE...</span>
                ) : (
                  <>
                    <span>TRANSMIT MESSAGE</span>
                    <Send size={14} />
                  </>
                )}
              </button>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-[#00E599]/20 border border-[#00E599] text-[#00E599] font-mono text-xs text-center font-bold"
                >
                  ✓ Message transmitted successfully. I will get back to you shortly!
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-mono text-xs text-center"
                >
                  {errorMessage || 'Failed to transmit message. Please email directly.'}
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}