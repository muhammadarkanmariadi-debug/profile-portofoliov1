import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Github, Globe, Layers, Calendar, UserCheck } from 'lucide-react'
import { getProjectBySlug, getProjects } from '@/lib/services/project.service'

export const revalidate = 0;

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage(props: ProjectPageProps) {
  const params = await props.params;
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getProjects(10);
  const currentIndex = allProjects.findIndex(p => p.id === project.id || p.slug === project.slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const displayDomain = project.liveUrl 
    ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') 
    : '4rkan.dev/case-study';

  return (
    <main className="w-full bg-[#EBEBEF] text-[#121217] pt-28 pb-32 min-h-screen px-6 sm:px-10 relative overflow-hidden select-none border-b border-[#D8D8E0]">
      
      {/* Background Watermark */}
      <div className="absolute top-24 right-0 font-heading font-black text-[22vw] leading-none text-[#121217] opacity-[0.03] pointer-events-none -z-0">
        PROJECT
      </div>

      <div className="max-w-[1350px] mx-auto relative z-10">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between border-b border-[#D8D8E0] pb-6 mb-12 font-mono text-xs uppercase tracking-[0.2em] text-[#707080]">
          <Link 
            href="/projects" 
            className="flex items-center gap-2 hover:text-[#121217] transition-colors cursor-target font-bold"
          >
            <ArrowLeft size={14} />
            <span>BACK TO ARCHIVE</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#121217]">02</span>
            <span>CASE STUDY</span>
          </div>
        </div>

        {/* Project Header */}
        <header className="mb-14 space-y-6">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-[#555566]">
            <span className="px-3 py-1 rounded-full bg-[#121217] text-white font-bold text-[10px]">
              {project.categoryEn}
            </span>
            <span>·</span>
            <span>{project.roleEn || 'Full-Stack Software Engineer'}</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] tracking-tighter text-[#121217] leading-[0.95] max-w-5xl">
            {project.titleEn}
          </h1>

          <p className="text-lg sm:text-xl text-[#444455] font-sans max-w-3xl leading-relaxed">
            {project.descriptionEn}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-[#121217] text-white hover:bg-[#333344] font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-target shadow-lg"
              >
                <span>VISIT LIVE PLATFORM</span>
                <ArrowUpRight size={15} />
              </a>
            )}

            {project.sourceCodeUrl && (
              <a 
                href={project.sourceCodeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-[#FFFFFF] border border-[#D5D5DF] hover:border-[#121217] text-[#121217] font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-target shadow-sm"
              >
                <Github size={15} />
                <span>SOURCE CODE</span>
              </a>
            )}
          </div>
        </header>

        {/* Desktop Browser Mockup Frame Showcase */}
        <div className="w-full rounded-3xl p-6 sm:p-10 bg-[#DCE7EB] border border-[#C2D4DC] shadow-xl mb-16 overflow-hidden">
          <div className="w-full bg-[#14141E] rounded-2xl overflow-hidden border border-black/30 shadow-2xl">
            
            {/* Window Top Bar */}
            <div className="bg-[#1A1A26] px-4 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]/80 inline-block" />
              </div>

              <div className="flex-1 max-w-md mx-4">
                <div className="bg-[#0E0E16] rounded-md px-3 py-1 text-[11px] font-mono text-[#7A7A90] text-center truncate">
                  https://{displayDomain}
                </div>
              </div>

              <div className="w-10" />
            </div>

            {/* Screen Image Preview */}
            <div className="w-full aspect-[16/9] bg-[#0E0E16] relative flex items-center justify-center overflow-hidden">
              {project.imageUrl ? (
                <img 
                  src={project.imageUrl} 
                  alt={project.titleEn}
                  className="w-full h-full object-cover object-top" 
                />
              ) : (
                <div className="text-center font-mono text-xs text-[#606075] p-8">
                  NO PREVIEW IMAGE AVAILABLE
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Project Technical Meta & Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#D8D8E0] pt-14 mb-20">
          
          {/* Left Metadata Matrix */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#707080] mb-3 flex items-center gap-2">
                <Layers size={14} />
                <span>TECH STACK & TOOLS</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((skill) => (
                  <span 
                    key={skill.id}
                    className="px-3.5 py-1.5 rounded-full bg-white border border-[#D5D5DF] font-mono text-xs text-[#121217] flex items-center gap-2 font-bold"
                  >
                    {skill.logoUrl && (
                      <img src={skill.logoUrl} alt={skill.title} className="w-3.5 h-3.5 object-contain" />
                    )}
                    <span>{skill.title}</span>
                  </span>
                ))}
                {(!project.techStack || project.techStack.length === 0) && (
                  <span className="font-mono text-xs text-[#707080]">Full-Stack Suite</span>
                )}
              </div>
            </div>

            <div className="border-t border-[#D8D8E0] pt-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#707080] mb-2 flex items-center gap-2">
                <UserCheck size={14} />
                <span>CORE RESPONSIBILITIES</span>
              </h3>
              <p className="text-sm text-[#444455] font-sans leading-relaxed">
                {project.roleEn || 'Full-Stack Software Engineering · Interface Design · API Architecture'}
              </p>
            </div>

            <div className="border-t border-[#D8D8E0] pt-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#707080] mb-2 flex items-center gap-2">
                <Calendar size={14} />
                <span>RELEASE TIMELINE</span>
              </h3>
              <p className="text-sm font-mono text-[#444455]">
                {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right Narrative / Overview */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#707080] mb-4">
                SYSTEM ARCHITECTURE & CONTEXT
              </h3>
              <div className="prose max-w-none text-[#222230] font-sans text-base leading-relaxed space-y-4">
                <p>
                  {project.descriptionEn}
                </p>
                {project.readmeContent && (
                  <div className="mt-8 p-6 rounded-2xl bg-white border border-[#D5D5DF] font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed text-[#333344]">
                    {project.readmeContent}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Next Project Footer Strip */}
        {nextProject && (
          <div className="border-t border-[#D8D8E0] pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-wider">
            <span className="text-[#707080]">CONTINUE EXPLORING</span>
            <Link 
              href={`/projects/${nextProject.slug || nextProject.id}`}
              className="flex items-center gap-3 text-lg sm:text-2xl font-heading font-black text-[#121217] hover:text-[#555566] transition-colors cursor-target"
            >
              <span>NEXT: {nextProject.titleEn}</span>
              <ArrowUpRight size={20} />
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
