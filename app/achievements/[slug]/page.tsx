import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Award, Calendar, ExternalLink, ShieldCheck } from 'lucide-react'
import { getAchievementBySlug, getAchievements } from '@/lib/services/achievement.service'

export const revalidate = 0;

interface AchievementPageProps {
  params: Promise<{ slug: string }>
}

export default async function AchievementDetailPage(props: AchievementPageProps) {
  const params = await props.params;
  const achievement = await getAchievementBySlug(params.slug);

  if (!achievement) {
    notFound();
  }

  const allAchievements = await getAchievements();
  const currentIndex = allAchievements.findIndex(a => a.id === achievement.id || a.slug === achievement.slug);
  const nextAchievement = allAchievements[(currentIndex + 1) % allAchievements.length];

  return (
    <main className="w-full bg-background text-text-primary pt-28 pb-32 min-h-screen px-6 sm:px-10 relative overflow-hidden select-none border-b border-border transition-colors duration-300">
      
      {/* Background Watermark */}
      <div className="absolute top-24 right-0 font-heading font-black text-[22vw] leading-none text-text-primary opacity-[0.03] pointer-events-none -z-0">
        AWARD
      </div>

      <div className="max-w-[1350px] mx-auto relative z-10">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between border-b border-border pb-6 mb-12 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
          <Link 
            href="/achievements" 
            className="flex items-center gap-2 hover:text-primary transition-colors cursor-target font-bold"
          >
            <ArrowLeft size={14} />
            <span>BACK TO CREDENTIALS</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="font-bold text-primary">04</span>
            <span>VERIFIED RECORD</span>
          </div>
        </div>

        {/* Credential Header */}
        <header className="mb-14 space-y-6">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-text-muted">
            <span className="px-3 py-1 rounded-full bg-primary text-background font-bold text-[10px] flex items-center gap-1.5">
              <Award size={13} />
              <span>{achievement.status}</span>
            </span>
            <span>·</span>
            <span>{new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] tracking-tighter text-text-primary leading-[0.95] max-w-5xl">
            {achievement.title}
          </h1>

          <p className="text-lg sm:text-xl text-text-muted font-sans max-w-3xl leading-relaxed">
            {achievement.description}
          </p>

          {/* Direct Document Action */}
          {achievement.imageUrl && (
            <div className="pt-4">
              <a 
                href={achievement.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-primary text-background hover:opacity-90 font-mono text-xs uppercase tracking-widest font-bold transition-all inline-flex items-center gap-2 cursor-target shadow-lg"
              >
                <span>OPEN FULL RESOLUTION DOCUMENT</span>
                <ExternalLink size={15} />
              </a>
            </div>
          )}
        </header>

        {/* Document Showcase Container */}
        {achievement.imageUrl && (
          <div className="w-full rounded-3xl p-6 sm:p-10 bg-surface border border-border shadow-xl mb-16 overflow-hidden">
            <div className="w-full rounded-2xl overflow-hidden bg-surface-elevated border border-white/10 shadow-2xl flex items-center justify-center p-4 sm:p-8">
              <img 
                src={achievement.imageUrl} 
                alt={achievement.title}
                className="w-full max-h-[75vh] object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        )}

        {/* Credential Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-border pt-14 mb-20">
          
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-2 flex items-center gap-2">
                <ShieldCheck size={14} className="text-primary" />
                <span>VERIFICATION STATUS</span>
              </h3>
              <p className="text-base font-bold text-text-primary">
                Authenticated Record
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-2 flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>CONFERENCE / ISSUE DATE</span>
              </h3>
              <p className="text-base font-mono text-text-primary">
                {new Date(achievement.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              ACHIEVEMENT CONTEXT & SUMMARY
            </h3>
            <p className="text-base sm:text-lg text-text-muted font-sans leading-relaxed">
              {achievement.description}
            </p>
          </div>

        </div>

        {/* Next Achievement Footer Strip */}
        {nextAchievement && (
          <div className="border-t border-border pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-wider">
            <span className="text-text-muted">CONTINUE BROWSING</span>
            <Link 
              href={`/achievements/${nextAchievement.slug || nextAchievement.id}`}
              className="flex items-center gap-3 text-lg sm:text-2xl font-heading font-black text-text-primary hover:text-primary transition-colors cursor-target"
            >
              <span>NEXT: {nextAchievement.title}</span>
              <ArrowUpRight size={20} />
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
