'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../providers'
import type { Skill } from '@prisma/client'

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
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
    <section id="skills" className="w-full bg-[#0B0B0E] text-[#FAFAFC] py-24 px-6 sm:px-10 border-b border-[#22222D]">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Section Header with Index */}
        <header className="w-full flex items-center justify-between border-b border-[#22222D] pb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#8E8E9F] mb-12">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white">03</span>
            <span>TECHNICAL ARCHITECTURE & SKILLS</span>
          </div>
          <span className="text-[#6C63FF] font-bold">ENGINEERING INDEX</span>
        </header>

        <div className="flex flex-col gap-10">
          
          {/* Category Tabs with spring indicator */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => {
              const isActive = activeTab === category
              return (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`relative px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider transition-colors cursor-target font-bold z-10 ${
                    isActive ? 'text-[#121217]' : 'text-[#8E8E9F] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-white rounded-full -z-10 shadow-lg"
                    />
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-[#121217] border border-[#22222D] rounded-full -z-20" />
                  )}
                  <span>{category.replace(/_/g, ' ')}</span>
                </button>
              )
            })}
          </div>

          {/* Active Category Skills Grid with Staggered Motion */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
            >
              {groupedSkills[activeTab]?.sort((a, b) => a.order - b.order).map((skill, index) => (
                <motion.div 
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-6 rounded-2xl flex flex-col items-center justify-center gap-4 bg-[#14141C] border border-[#22222F] hover:border-[#6C63FF]/60 hover:bg-[#181824] transition-colors cursor-target group transform-gpu"
                >
                  {skill.logoUrl ? (
                    <div className="w-12 h-12 flex items-center justify-center relative">
                      <img 
                        src={skill.logoUrl} 
                        alt={skill.title} 
                        className="max-w-full max-h-full object-contain filter group-hover:drop-shadow-[0_0_12px_rgba(108,99,255,0.4)] transition-all duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#1C1C28] flex items-center justify-center font-mono font-bold text-lg text-[#6C63FF] border border-white/5">
                      {skill.title.charAt(0)}
                    </div>
                  )}

                  <span className="font-mono text-xs uppercase tracking-wider text-center text-[#E0E0EC] group-hover:text-white font-bold transition-colors">
                    {skill.title}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  )
}