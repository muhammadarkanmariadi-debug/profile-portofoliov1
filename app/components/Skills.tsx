'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'
import { useLanguage } from '../providers'
import type { Skill } from '@prisma/client'

interface SkillsProps {
  skills: Skill[];
}

const Skills = ({ skills }: SkillsProps) => {
  const { t } = useLanguage()
  
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = Object.keys(groupedSkills).sort();
  const [activeTab, setActiveTab] = useState(categories.length > 0 ? categories[0] : 'FRONTEND')

  if (categories.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-10" id="skills">
      <div className="max-w-[1200px] mx-auto">
        
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full skill-badge mb-4"
          >
            <Terminal size={14} className="text-secondary" />
            <span className="font-mono text-xs uppercase text-on-surface">{t.skills.badge}</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="font-heading text-4xl lg:text-5xl mb-4 text-glow text-on-surface font-bold"
          >
            {t.skills.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="font-sans text-lg text-on-surface-variant max-w-2xl leading-relaxed"
          >
            {t.skills.desc}
          </motion.p>
        </header>

        <div className="flex flex-col gap-12">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-6 py-3 rounded-full font-mono text-sm uppercase tracking-widest transition-all cursor-target ${
                  activeTab === category
                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(108,99,255,0.4)]'
                    : 'bg-surface/50 text-on-surface-variant hover:bg-surface hover:text-on-surface border border-border'
                }`}
              >
                {category.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Active Category Cards */}
          <motion.div 
            key={activeTab} // Forces re-animation when tab changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {groupedSkills[activeTab]?.sort((a,b) => a.order - b.order).map((skill) => (
              <motion.div 
                key={skill.id}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center gap-4 group cursor-target"
              >
                <div className="w-16 h-16 relative flex items-center justify-center transition-transform group-hover:scale-110">
                  {skill.logoUrl ? (
                    <img 
                      src={skill.logoUrl} 
                      alt={skill.title}
                      className="w-full h-full object-contain filter drop-shadow-md"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-4xl font-bold text-gray-500">{skill.title[0]}</div>
                  )}
                </div>
                <h4 className="font-heading text-base font-semibold text-on-surface text-center mt-2 group-hover:text-primary transition-colors">
                  {skill.title}
                </h4>
              </motion.div>
            ))}
          </motion.div>

        </div>

        {/* Interpersonal Expertise */}
        <div className="mt-24 text-center">
          <h3 className="font-mono text-sm uppercase tracking-widest text-on-surface-variant/60 mb-8">{t.skills.interpersonalTitle}</h3>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {t.skills.interpersonal.map((softSkill, idx) => (
              <span key={idx} className="skill-badge px-6 py-2 rounded-full font-mono text-sm uppercase cursor-target text-on-surface">
                {softSkill}
              </span>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}

export default Skills