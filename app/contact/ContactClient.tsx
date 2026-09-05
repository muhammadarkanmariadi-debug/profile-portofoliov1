'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Send, MapPin, Mail, Phone } from 'lucide-react'
import type { Profile } from '@prisma/client'

interface ContactClientProps {
  profile: Profile
}

export default function ContactClient({ profile }: ContactClientProps) {
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const email = profile?.email || 'muhammadarkanmariadi@gmail.com'

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

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
    <main className="w-full bg-[#82D8CE] text-[#121217] pt-32 pb-32 min-h-screen px-6 sm:px-10 relative select-none overflow-hidden">

      {/* Background Watermark 05 */}
      <div className="absolute right-0 bottom-10 font-heading font-black text-[28vw] leading-none text-[#121217] opacity-[0.06] pointer-events-none z-0">
        05
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Top Header Index */}
        <header className="mb-16 border-b border-[#6AC4B9] pb-8 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-[#2C625B]">
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

              <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-[5.5vw] tracking-tighter leading-[0.95] text-[#121217] mb-8">
                <span>Let&#39;s make</span> <br />
                <span>something impossible</span> <br />
                <span
                  className="text-transparent inline-block"
                  style={{
                    WebkitTextStroke: '2px #121217'
                  }}
                >
                  to ignore.
                </span>
              </h1>
            </div>

            {/* Full-width Dark Pill Email Bar */}
            <div>
              <div
                onClick={handleCopyEmail}
                className="w-full bg-[#121217] text-[#82D8CE] hover:bg-[#1A1A22] rounded-full p-4 pl-6 sm:pl-8 flex items-center justify-between shadow-2xl transition-all duration-300 group cursor-target border border-black/30"
              >
                <div className="flex flex-col truncate pr-4">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#6AC4B9]">
                    {copied ? 'COPIED TO CLIPBOARD!' : 'DIRECT EMAIL ADDRESS'}
                  </span>
                  <span className="font-heading font-bold text-lg sm:text-2xl text-white tracking-tight truncate group-hover:text-[#82D8CE] transition-colors">
                    {email}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-full bg-[#82D8CE] text-[#121217] flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-white transition-all shadow-md">
                  {copied ? <Check size={20} className="text-[#121217]" /> : <ArrowUpRight size={22} className="text-[#121217]" />}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#2C625B] mt-3 px-4">
                <span>CLICK BAR TO COPY EMAIL</span>
                <a href={`mailto:${email}`} className="underline hover:text-[#121217] transition-colors font-semibold cursor-target">
                  OPEN IN CLIENT ↗
                </a>
              </div>
            </div>

            {/* Quick Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#6AC4B9] font-mono text-xs text-[#2C625B]">
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
          <div className="lg:col-span-5 bg-[#121217] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-black/30">
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
                  className="w-full bg-[#1A1A24] border border-[#2B2B3A] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#82D8CE] transition-colors"
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
                  className="w-full bg-[#1A1A24] border border-[#2B2B3A] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#82D8CE] transition-colors"
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
                  className="w-full bg-[#1A1A24] border border-[#2B2B3A] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#82D8CE] transition-colors resize-none"
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