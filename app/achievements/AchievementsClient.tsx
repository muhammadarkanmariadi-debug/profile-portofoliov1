'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import AchievementCard from '@/app/components/AchievementCard'
import { useLanguage } from '@/app/providers'
import type { Achievement } from '@prisma/client'

interface AchievementsClientProps {
  initialAchievements: Achievement[]
}

export default function AchievementsClient({ initialAchievements }: AchievementsClientProps) {
  const { t, lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const filteredAchievements = initialAchievements.filter(achievement => {
    const title = lang === 'id' ? achievement.titleId : achievement.titleEn
    const status = lang === 'id' ? achievement.statusId : achievement.statusEn
    
    return title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           status?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage)
  
  // Slice for current page
  const currentAchievements = filteredAchievements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 on search
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemsPerPage])

  return (
    <main className="max-w-[1200px] mx-auto px-6 md:px-10 pt-40 pb-32 min-h-screen">
      {/* Background Element */}
      <div className="fixed inset-0 grid-texture pointer-events-none -z-10 opacity-30"></div>

      <header className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-[1px] bg-secondary"></span>
          <span className="font-mono text-xs text-secondary uppercase tracking-widest">{t.achievements.badge}</span>
        </div>
        <h1 className="font-heading text-5xl md:text-6xl text-on-surface max-w-2xl font-bold leading-tight mb-12">
          {t.achievements.pageTitle} <span className="text-primary italic font-serif">{t.achievements.pageTitleHighlight}</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-4 items-center max-w-4xl">
          <div className="relative group w-full flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 group-focus-within:text-secondary transition-colors" size={20} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface/65 backdrop-blur-xl border border-border rounded-xl py-4 pl-12 pr-4 text-on-surface font-sans focus:outline-none focus:border-secondary/50 transition-all placeholder:text-on-surface-variant/50 cursor-target"
              placeholder={t.achievements.searchPlaceholder}
            />
          </div>
          
          <div className="relative w-1/2">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full md:w-auto flex items-center justify-between gap-4 bg-surface/65 backdrop-blur-xl border border-border rounded-xl px-5 py-4 text-on-surface font-sans hover:border-secondary/50 transition-all cursor-target"
            >
              <span>{t.achievements.showItems} {itemsPerPage}</span>
              <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-full md:w-auto min-w-[120px] bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-20">
                {[3, 6, 9, 12, 15].map(num => (
                  <button
                    key={num}
                    onClick={() => {
                      setItemsPerPage(num)
                      setIsDropdownOpen(false)
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-primary/20 hover:text-primary transition-colors text-on-surface cursor-target"
                  >
                    {num} {t.achievements.items}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AchievementCard
              id={achievement.id}
              title={lang === 'id' ? (achievement.titleId || '') : (achievement.titleEn || '')}
              description={lang === 'id' ? (achievement.descriptionId || '') : (achievement.descriptionEn || '')}
              imageUrl={achievement.imageUrl || ''}
              status={lang === 'id' ? (achievement.statusId || '') : (achievement.statusEn || '')}
              date={achievement.date}
            />
          </motion.div>
        ))}
        {filteredAchievements.length === 0 && (
          <div className="col-span-full py-20 text-center text-on-surface-variant font-mono">
            {t.achievements.notFound} &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-border text-on-surface hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-on-surface transition-colors cursor-target"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2 font-mono text-sm">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-target ${
                  currentPage === i + 1 
                    ? 'bg-primary text-white font-bold' 
                    : 'hover:bg-surface border border-transparent hover:border-border text-on-surface-variant'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-border text-on-surface hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-on-surface transition-colors cursor-target"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </main>
  )
}
