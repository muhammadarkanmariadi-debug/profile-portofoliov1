import React from 'react'
import ThemeParticles from './components/ThemeParticles'
import Hero from './components/Hero'
import Aboutme from './components/Aboutme'

import Projects from './components/Projects'
import Skills from './components/Skills'
import Achievements from './components/Achievements'


import { getProfile } from '@/lib/services/profile.service'
import { getTimeline } from '@/lib/services/timeline.service'
import { getSkills } from '@/lib/services/skill.service'
import { getProjects } from '@/lib/services/project.service'
import { getAchievements } from '@/lib/services/achievement.service'

export const revalidate = 0;

const Page = async () => {
  // Fetch all data server-side
  const [profile, timeline, skills, projects, achievements] = await Promise.all([
    getProfile(),
    getTimeline(),
    getSkills(),
    getProjects(),
    getAchievements()
  ]);

  return (
    <div className='flex flex-col w-full relative'>
      <div className='absolute inset-0 w-full h-screen -z-10 pointer-events-none opacity-50'>
        <ThemeParticles />
      </div>

      <Hero profile={profile} />

      <div className='flex flex-col gap-32 w-full mt-20'>
        <Aboutme profile={profile} timeline={timeline} />

        <Projects projects={projects} />
        <Skills skills={skills} />
        <Achievements achievements={achievements} />
      </div>
    </div>
  )
}

export default Page
