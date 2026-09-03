'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, ChevronDown, ArrowUpRight } from 'lucide-react'
import ProjectCard from '@/app/components/ProjectCard'
import ProjectModal from '@/app/components/ProjectModal'
import { useLanguage } from '@/app/providers'
import type { ProjectWithTech } from '@/lib/services/project.service'

interface ProjectsClientProps {
  initialProjects: ProjectWithTech[]
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const filteredProjects = initialProjects.filter(project => {
    const title = lang === 'id' ? project.titleId : project.titleEn
    const category = lang === 'id' ? project.categoryId : project.categoryEn
    
    return title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           category?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  
  // Slice for current page
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const selectedProject = selectedProjectId 
    ? initialProjects.find(p => p.id === selectedProjectId) || null 
    : null

  // Reset to page 1 on search
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemsPerPage])

  return (
    <main className="w-full bg-[#EBEBEF] text-[#121217] pt-28 pb-32 min-h-screen px-6 sm:px-10 relative overflow-hidden select-none border-b border-[#D8D8E0]">
      
      {/* Background Watermark 02 */}
      <div className="absolute top-20 right-0 font-heading font-black text-[25vw] leading-none text-[#121217] opacity-[0.04] pointer-events-none -z-0">
        02
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Editorial Top Section Header */}
        <header className="mb-16 border-b border-[#D8D8E0] pb-10">
          
          {/* Index & Breadcrumb */}
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-[#707080] mb-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#121217]">02</span>
              <span>SELECTED REPOSITORIES & SYSTEMS</span>
            </div>
            <span>PRODUCTION INDEX</span>
          </div>

          {/* Giant Typography */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-[6.5vw] tracking-tighter text-[#121217] leading-[0.92]">
              Selected <br />
              <span className="text-[#707080]">Architecture</span>
            </h1>

            <p className="max-w-md font-sans text-sm sm:text-base text-[#555566] leading-relaxed">
              High-performance production web systems, real-time architectures, and enterprise platforms engineered for scale.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-[#D8D8E0]">
            <div className="relative group w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707080] group-focus-within:text-[#121217] transition-colors" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#D5D5DF] rounded-full py-3 pl-11 pr-4 text-[#121217] font-mono text-xs focus:outline-none focus:border-[#121217] transition-all placeholder:text-[#9090A0]"
                placeholder="Search by name, technology stack, or category..."
              />
            </div>
            
            <div className="relative self-end sm:self-auto">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-3 px-5 py-2.5 rounded-full bg-[#FFFFFF] border border-[#D5D5DF] text-[#121217] font-mono text-xs uppercase tracking-wider hover:border-[#121217] transition-all font-bold"
              >
                <span>SHOW {itemsPerPage} PER PAGE</span>
                <ChevronDown size={14} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] border border-[#D5D5DF] rounded-2xl shadow-xl z-30 overflow-hidden font-mono text-xs">
                  {[3, 6, 9, 12].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setItemsPerPage(num)
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-[#F0F0F5] transition-colors ${itemsPerPage === num ? 'text-[#121217] font-bold bg-[#EAEAEF]' : 'text-[#707080]'}`}
                    >
                      {num} ITEMS
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic & Asymmetrical Project Cases */}
        <div className="space-y-16">
          {currentProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <ProjectCard
                id={project.id}
                slug={project.slug}
                index={String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                title={lang === 'id' ? (project.titleId || '') : (project.titleEn || '')}
                description={lang === 'id' ? (project.descriptionId || '') : (project.descriptionEn || '')}
                role={lang === 'id' ? project.roleId : project.roleEn}
                liveUrl={project.liveUrl}
                imageUrl={project.imageUrl || ''}
                category={lang === 'id' ? (project.categoryId || '') : (project.categoryEn || '')}
                techStack={project.techStack}
                onReadMore={() => setSelectedProjectId(project.id)}
              />
            </motion.div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="py-24 text-center text-[#707080] font-mono text-sm">
              No projects found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-20 pt-8 border-t border-[#D8D8E0] font-mono text-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full border border-[#D5D5DF] bg-white text-[#121217] disabled:opacity-30 hover:border-[#121217] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-4 text-[#707080] font-bold">
              PAGE {currentPage} OF {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full border border-[#D5D5DF] bg-white text-[#121217] disabled:opacity-30 hover:border-[#121217] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>

      <ProjectModal 
        isOpen={!!selectedProjectId} 
        onClose={() => setSelectedProjectId(null)} 
        project={selectedProject} 
      />
    </main>
  )
}
