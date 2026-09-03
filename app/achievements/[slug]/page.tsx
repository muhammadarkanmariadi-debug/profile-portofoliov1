import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Award, Calendar, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react'
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
    <main className="w-full bg-[#EBEBEF] text-[#121217] pt-28 pb-32 min-h-screen px-6 sm:px-10 relative overflow-hidden select-none border-b border-[#D8D8E0]">
      
      {/* Background Watermark */}
      <div className="absolute top-24 right-0 font-heading font-black text-[22vw] leading-none text-[#121217] opacity-[0.03] pointer-events-none -z-0">
        AWARD
      </div>

      <div className="max-w-[1350px] mx-auto relative z-10">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between border-b border-[#D8D8E0] pb-6 mb-12 font-mono text-xs uppercase tracking-[0.2em] text-[#707080]">
          <Link 
            href="/achievements" 
            className="flex items-center gap-2 hover:text-[#121217] transition-colors cursor-target font-bold"
          >
            <ArrowLeft size={14} />
            <span>BACK TO CREDENTIALS</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#121217]">04</span>
            <span>VERIFIED RECORD</span>
          </div>
        </div>

        {/* Credential Header */}
        <header className="mb-14 space-y-6">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-[#555566]">
            <span className="px-3 py-1 rounded-full bg-[#121217] text-white font-bold text-[10px] flex items-center gap-1.5">
              <Award size={13} />
              <span>{achievement.statusEn}</span>
            </span>
            <span>·</span>
            <span>{new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] tracking-tighter text-[#121217] leading-[0.95] max-w-5xl">
            {achievement.titleEn}
          </h1>

          <p className="text-lg sm:text-xl text-[#444455] font-sans max-w-3xl leading-relaxed">
            {achievement.descriptionEn}
          </p>

          {/* Direct Document Action */}
          {achievement.imageUrl && (
            <div className="pt-4">
              <a 
                href={achievement.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-[#121217] text-white hover:bg-[#333344] font-mono text-xs uppercase tracking-widest font-bold transition-all inline-flex items-center gap-2 cursor-target shadow-lg"
              >
                <span>OPEN FULL RESOLUTION DOCUMENT</span>
                <ExternalLink size={15} />
              </a>
            </div>
          )}
        </header>

        {/* Document Showcase Container */}
        {achievement.imageUrl && (
          <div className="w-full rounded-3xl p-6 sm:p-10 bg-[#DBECE6] border border-[#C3DDD4] shadow-xl mb-16 overflow-hidden">
            <div className="w-full rounded-2xl overflow-hidden bg-white/80 border border-black/10 shadow-2xl flex items-center justify-center p-4 sm:p-8">
              <img 
                src={achievement.imageUrl} 
                alt={achievement.titleEn}
                className="w-full max-h-[75vh] object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        )}

        {/* Credential Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#D8D8E0] pt-14 mb-20">
          
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#707080] mb-2 flex items-center gap-2">
                <ShieldCheck size={14} />
                <span>VERIFICATION STATUS</span>
              </h3>
              <p className="text-base font-bold text-[#121217]">
                Authenticated Record
              </p>
            </div>

            <div className="border-t border-[#D8D8E0] pt-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#707080] mb-2 flex items-center gap-2">
                <Calendar size={14} />
                <span>CONFERENCE / ISSUE DATE</span>
              </h3>
              <p className="text-base font-mono text-[#121217]">
                {new Date(achievement.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#707080]">
              ACHIEVEMENT CONTEXT & SUMMARY
            </h3>
            <p className="text-base sm:text-lg text-[#333344] font-sans leading-relaxed">
              {achievement.descriptionEn}
            </p>
          </div>

        </div>

        {/* Next Achievement Footer Strip */}
        {nextAchievement && (
          <div className="border-t border-[#D8D8E0] pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-wider">
            <span className="text-[#707080]">CONTINUE BROWSING</span>
            <Link 
              href={`/achievements/${nextAchievement.slug || nextAchievement.id}`}
              className="flex items-center gap-3 text-lg sm:text-2xl font-heading font-black text-[#121217] hover:text-[#555566] transition-colors cursor-target"
            >
              <span>NEXT: {nextAchievement.titleEn}</span>
              <ArrowUpRight size={20} />
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
