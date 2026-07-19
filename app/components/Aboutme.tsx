'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Sparkles, Layers, PencilRuler } from 'lucide-react'
import { useLanguage } from '../providers'
import type { Profile, TimelineEntry } from '@prisma/client'

interface AboutmeProps {
  profile: Profile;
  timeline: TimelineEntry[];
}

const Aboutme = ({ profile, timeline }: AboutmeProps) => {
  const { t, lang } = useLanguage()

  // Split the full biography into paragraphs, fallback to default translations if empty
  const bioRaw = lang === 'id' ? profile.fullBiographyId : profile.fullBiographyEn;
  const bioParagraphs = bioRaw 
    ? bioRaw.split('\n').filter(p => p.trim() !== '')
    : [t.about.p1, t.about.p2, t.about.p3];

  return (
    <section className="py-24 px-6 md:px-10 bg-surface/30 relative" id="about">
      <div className="max-w-[1200px] mx-auto space-y-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Biography */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="font-mono text-sm text-primary uppercase tracking-widest">{t.about.sectionTitle}</span>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-on-surface leading-tight">
                {t.about.headline}
              </h2>
            </div>
            <div className="space-y-6 text-on-surface-variant text-lg font-sans leading-relaxed">
              {bioParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </motion.div>

          {/* Education Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 space-y-8"
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="text-primary" size={28} />
              <h3 className="font-heading text-2xl font-semibold text-on-surface">{t.about.educationTitle}</h3>
            </div>
            
            <div className="space-y-10 relative">
              {/* Timeline Vertical Line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary to-transparent opacity-30"></div>
              
              {timeline.filter(item => item.type === 'EDUCATION').map((item, idx) => (
                <div key={item.id} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div className={`absolute ${idx === 0 ? 'left-2.5 top-2 w-3 h-3 bg-primary shadow-[0_0_10px_rgba(108,99,255,0.8)]' : 'left-3 top-2 w-2 h-2 bg-border'} rounded-full`}></div>
                  <p className={`font-mono text-xs uppercase mb-1 ${idx === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{lang === 'id' ? item.categoryId : item.categoryEn}</p>
                  <h4 className="font-sans font-bold text-lg text-on-surface">{lang === 'id' ? item.titleId : item.titleEn}</h4>
                  <p className="text-on-surface-variant/80 text-sm mt-2 leading-relaxed">{lang === 'id' ? item.descriptionId : item.descriptionEn}</p>
                </div>
              ))}
            </div>

            {/* Experience Timeline */}
            <div className="flex items-center gap-3 mt-12">
              <Sparkles className="text-primary" size={28} />
              <h3 className="font-heading text-2xl font-semibold text-on-surface">Experience</h3>
            </div>
            
            <div className="space-y-10 relative">
              {/* Timeline Vertical Line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary to-transparent opacity-30"></div>
              
              {timeline.filter(item => item.type === 'EXPERIENCE').map((item, idx) => (
                <div key={item.id} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div className={`absolute ${idx === 0 ? 'left-2.5 top-2 w-3 h-3 bg-primary shadow-[0_0_10px_rgba(108,99,255,0.8)]' : 'left-3 top-2 w-2 h-2 bg-border'} rounded-full`}></div>
                  <p className={`font-mono text-xs uppercase mb-1 ${idx === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{lang === 'id' ? item.categoryId : item.categoryEn}</p>
                  <h4 className="font-sans font-bold text-lg text-on-surface">{lang === 'id' ? item.titleId : item.titleEn}</h4>
                  <p className="text-on-surface-variant/80 text-sm mt-2 leading-relaxed">{lang === 'id' ? item.descriptionId : item.descriptionEn}</p>
                </div>
              ))}
            </div>

          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: t.about.precision.title, desc: t.about.precision.desc },
            { icon: Layers, title: t.about.scalability.title, desc: t.about.scalability.desc },
            { icon: PencilRuler, title: t.about.aesthetics.title, desc: t.about.aesthetics.desc }
          ].map((value, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 space-y-4"
            >
              <value.icon className="text-primary" size={32} />
              <h4 className="font-heading text-xl font-semibold text-on-surface">{value.title}</h4>
              <p className="text-on-surface-variant font-sans">{value.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Aboutme