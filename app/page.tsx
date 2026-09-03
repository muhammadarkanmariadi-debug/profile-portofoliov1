import React from 'react'
import SiteLoader from './components/SiteLoader'
import Hero from './components/Hero'
import Aboutme from './components/Aboutme'
import Projects from './components/Projects'
import Skills from './components/Skills'
import AchievementsStrip from './components/AchievementsStrip'
import ContactCTA from './components/ContactCTA'

import { getProfile } from '@/lib/services/profile.service'
import { getTimeline } from '@/lib/services/timeline.service'
import { getSkills } from '@/lib/services/skill.service'
import { getProjects } from '@/lib/services/project.service'
import { getAchievements } from '@/lib/services/achievement.service'

export const revalidate = 0;

const Page = async () => {
  // Fetch data server-side
  const [profile, timeline, skills, projects, achievements] = await Promise.all([
    getProfile(),
    getTimeline(),
    getSkills(),
    getProjects(5),
    getAchievements()
  ]);

  return (
    <main className="flex flex-col w-full relative min-h-screen bg-[#0B0B0E]">
      {/* 0. Intro Experience Preloader (Screenshot 1 Match) */}
      <SiteLoader />

      {/* 1. Hero 3D Chrome Torus Centerpiece (Hero Screenshot Match) */}
      <Hero profile={profile} />

      {/* 2. Kinetic Scrub Statement & Background (Screenshot 2 Match) */}
      <Aboutme profile={profile} timeline={timeline} />

      {/* 3. Selected Work Desktop Browser Mockup (Screenshot 3 Match) */}
      <Projects projects={projects} isLanding={true} />

      {/* 4. Technical Stack Matrix (Index 03) */}
      <Skills skills={skills} />

      {/* 5. Verified Credentials Highlight (Index 04) */}
      <AchievementsStrip achievements={achievements} />

      {/* 6. Mint-Teal Contact CTA & Email Bar (Screenshot 4 Match / Index 05) */}
      <ContactCTA profile={profile} />
    </main>
  )
}

export default Page
