'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useLanguage } from '@/app/providers'

import type { Profile } from '@prisma/client'

interface ContactClientProps {
  profile: Profile
}

export default function ContactClient({ profile }: ContactClientProps) {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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
      setTimeout(() => setStatus('idle'), 5000) // Hide popup after 5 seconds
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <main className="max-w-[1200px] mx-auto px-6 md:px-10 pt-40 pb-32 min-h-screen relative" id="contact">
      {/* Background Element */}
      <div className="fixed inset-0 grid-texture pointer-events-none -z-10 opacity-30"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Column */}
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="font-heading text-5xl md:text-6xl text-on-surface leading-tight font-bold">
              {t.contact.badge} <br/>
              <span className="text-primary text-glow">{t.contact.titleHighlight}</span>
            </h2>
            <p className="text-on-surface-variant font-sans text-lg max-w-lg leading-relaxed">
              {t.contact.desc}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Mail size={24} />
              </div>
              <div>
                <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-1">{t.contact.email}</p>
                <p className="text-on-surface font-semibold text-lg">{profile.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Phone size={24} />
              </div>
              <div>
                <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-1">{t.contact.phone}</p>
                <p className="text-on-surface font-semibold text-lg">{profile.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-1">{t.contact.location}</p>
                <p className="text-on-surface font-semibold text-lg">{profile.address}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:pl-12"
        >
          <div className="glass-card p-8 md:p-12 rounded-[2rem] relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
            
            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-on-surface-variant tracking-widest" htmlFor="name">{t.contact.nameLabel}</label>
                <input 
                  className="w-full bg-surface/50 border border-border focus:border-primary px-5 py-4 rounded-xl text-on-surface font-sans transition-colors outline-none" 
                  id="name" 
                  name="name" 
                  placeholder={t.contact.namePlaceholder} 
                  type="text"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-on-surface-variant tracking-widest" htmlFor="email">{t.contact.emailLabel}</label>
                <input 
                  className="w-full bg-surface/50 border border-border focus:border-primary px-5 py-4 rounded-xl text-on-surface font-sans transition-colors outline-none" 
                  id="email" 
                  name="email" 
                  placeholder={t.contact.emailPlaceholder}
                  type="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-on-surface-variant tracking-widest" htmlFor="message">{t.contact.messageLabel}</label>
                <textarea 
                  className="w-full bg-surface/50 border border-border focus:border-primary px-5 py-4 rounded-xl text-on-surface font-sans transition-colors outline-none resize-none" 
                  id="message" 
                  name="message" 
                  placeholder={t.contact.messagePlaceholder}
                  rows={5}
                  required
                  minLength={10}
                ></textarea>
              </div>

              {/* Success Popup / Toast */}
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-10 right-10 z-50 p-4 bg-[#111111] border border-primary/30 shadow-[0_0_20px_rgba(108,99,255,0.2)] rounded-xl flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <Send size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-heading">Berhasil!</h4>
                    <p className="text-gray-400 text-sm">Pesan terkirim, saya akan segera membalas.</p>
                  </div>
                </motion.div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                  {errorMessage}
                </div>
              )}

              <button 
                className="w-full py-5 bg-primary hover:bg-opacity-90 rounded-xl text-white font-heading font-bold text-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : t.contact.sendBtn}
                {!isSubmitting && <Send size={20} />}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
      
      {/* Map Graphic (Visual Context) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-32 w-full h-[400px] rounded-[2rem] glass-card overflow-hidden relative group"
      >
        <div className="w-full h-full bg-cover bg-center grayscale contrast-125 opacity-30 group-hover:opacity-50 transition-opacity duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBj-EuL6s--WiO4V0ExwexfDgSXRW-E08_oW6pFn22Q0_3Njv1nhkC1G51OR93RQ3hkc8-L2jClShVyppHzzMXGmmFZ9ExsDewPRL9ZfgOxodG50O85lLWD3bhLhrEcg1zlB0pUniIWQsHGAnm877EV-rcuVkabhREtqCk0W3XzEx7h1HjNIOQgtjm4o_bE8fQPIygOrcJCjMOmxSTnd0DPvebp80ZRxrWVxGvregvKQWzJkBtp35NSlgiHZSPrvvpCQx6l-Fdr2JU')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="glass-card px-8 py-4 rounded-full flex items-center gap-3 animate-pulse bg-surface">
            <span className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_#00D9C0]"></span>
            <span className="font-mono text-sm uppercase tracking-widest text-on-surface">{t.contact.localMeetup}</span>
          </div>
        </div>
      </motion.div>
    </main>
  )
}