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
    <main className="w-full bg-background text-text-primary pt-28 pb-32 min-h-screen px-6 sm:px-10 relative overflow-hidden select-none border-b border-border transition-colors duration-300">
      
      {/* Background Watermark */}
      <div className="absolute top-24 right-0 font-heading font-black text-[22vw] leading-none text-text-primary opacity-[0.03] pointer-events-none -z-0">
        PROJECT
      </div>

      <div className="max-w-[1350px] mx-auto relative z-10">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between border-b border-border pb-6 mb-12 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
          <Link 
            href="/projects" 
            className="flex items-center gap-2 hover:text-primary transition-colors cursor-target font-bold"
          >
            <ArrowLeft size={14} />
            <span>BACK TO ARCHIVE</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="font-bold text-primary">02</span>
            <span>CASE STUDY</span>
          </div>
        </div>

        {/* Project Header */}
        <header className="mb-14 space-y-6">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-text-muted">
            <span className="px-3 py-1 rounded-full bg-primary text-background font-bold text-[10px]">
              {project.category}
            </span>
            <span>·</span>
            <span>{project.role || 'Full-Stack Software Engineer'}</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] tracking-tighter text-text-primary leading-[0.95] max-w-5xl">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-text-muted font-sans max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-primary text-background hover:opacity-90 font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-target shadow-lg"
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
                className="px-6 py-3.5 rounded-full bg-surface border border-border hover:border-primary/50 text-text-primary font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-target shadow-sm"
              >
                <Github size={15} />
                <span>SOURCE CODE</span>
              </a>
            )}
          </div>
        </header>

        {/* Desktop Browser Mockup Frame Showcase */}
        <div className="w-full rounded-3xl p-6 sm:p-10 bg-surface border border-border shadow-xl mb-16 overflow-hidden">
          <div className="w-full bg-[#14141E] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            
            {/* Window Top Bar */}
            <div className="bg-[#111216] px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]/80 inline-block" />
              </div>

              <div className="flex-1 max-w-md mx-4">
                <div className="bg-[#1C1F26] rounded-md px-3 py-1 text-[11px] font-mono text-[#7A7A90] text-center truncate">
                  https://{displayDomain}
                </div>
              </div>

              <div className="w-10" />
            </div>

            {/* Screen Image Preview */}
            <div className="w-full aspect-[16/9] bg-[#0D0E11] relative flex items-center justify-center overflow-hidden">
              {project.imageUrl ? (
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-top" 
                />
              ) : (
                <div className="text-center font-mono text-xs text-text-muted p-8">
                  NO PREVIEW IMAGE AVAILABLE
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Project Technical Meta & Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-border pt-14 mb-20">
          
          {/* Left Metadata Matrix */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-3 flex items-center gap-2">
                <Layers size={14} className="text-primary" />
                <span>TECH STACK & TOOLS</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((skill) => (
                  <span 
                    key={skill.id}
                    className="px-3.5 py-1.5 rounded-full bg-surface border border-border font-mono text-xs text-text-primary flex items-center gap-2 font-bold"
                  >
                    {skill.logoUrl && (
                      <img src={skill.logoUrl} alt={skill.title} className="w-3.5 h-3.5 object-contain" />
                    )}
                    <span>{skill.title}</span>
                  </span>
                ))}
                {(!project.techStack || project.techStack.length === 0) && (
                  <span className="font-mono text-xs text-text-muted">Full-Stack Suite</span>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-2 flex items-center gap-2">
                <UserCheck size={14} className="text-primary" />
                <span>CORE RESPONSIBILITIES</span>
              </h3>
              <p className="text-sm text-text-muted font-sans leading-relaxed">
                {project.role || 'Full-Stack Software Engineering · Interface Design · API Architecture'}
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-2 flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>RELEASE TIMELINE</span>
              </h3>
              <p className="text-sm font-mono text-text-muted">
                {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right Narrative / Overview */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-4">
                SYSTEM ARCHITECTURE & CONTEXT
              </h3>
              <div className="prose max-w-none text-text-primary font-sans text-base leading-relaxed space-y-4">
                <p>
                  {project.description}
                </p>
                {project.readmeContent && (
                  <div className="mt-8 p-6 rounded-2xl bg-surface border border-border font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed text-text-primary">
                    {project.readmeContent}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Next Project Footer Strip */}
        {nextProject && (
          <div className="border-t border-border pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-wider">
            <span className="text-text-muted">CONTINUE EXPLORING</span>
            <Link 
              href={`/projects/${nextProject.slug || nextProject.id}`}
              className="flex items-center gap-3 text-lg sm:text-2xl font-heading font-black text-text-primary hover:text-primary transition-colors cursor-target"
            >
              <span>NEXT: {nextProject.title}</span>
              <ArrowUpRight size={20} />
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
