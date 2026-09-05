import React from 'react'
import SiteLoader from './components/SiteLoader'
import Hero from './components/Hero'
import Aboutme from './components/Aboutme'
import Projects from './components/Projects'
import Skills from './components/Skills'
import EngineeringApproachSection from './components/EngineeringApproachSection'
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
    <main className="flex flex-col w-full relative min-h-screen bg-background transition-colors duration-300">
      {/* 0. Intro Experience Preloader */}
      <SiteLoader />

      {/* 1. Hero 3D Chrome Torus Centerpiece */}
      <Hero profile={profile} />

      {/* 2. Kinetic Scrub Statement & Background */}
      <Aboutme profile={profile} timeline={timeline} />

      {/* 3. Selected Work Desktop Browser Mockup */}
      <Projects projects={projects} isLanding={true} />

      {/* 4. Technical Stack Matrix (Index 03) */}
      <Skills skills={skills} />

      {/* 5. Sequential Scroll-Triggered Stacked Cards: Engineering Methodology */}
      <EngineeringApproachSection />

      {/* 6. Verified Credentials Highlight (Index 04) */}
      <AchievementsStrip achievements={achievements} />

      {/* 7. Ultimate Finale Connect & Contact CTA Section (Index 05) */}
      <ContactCTA profile={profile} />
    </main>
  )
}

export default Page
