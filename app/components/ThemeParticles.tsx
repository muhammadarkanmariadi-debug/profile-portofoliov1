'use client'
import React from 'react'
import Particles from '@/components/Particles'
import { useTheme } from '@/app/providers'

export default function ThemeParticles() {
  const { theme } = useTheme()

  return (
    <Particles
      particleColors={theme === 'light' ? ['#000000'] : ['#ffffff']}
      particleCount={200}
      particleSpread={10}
      speed={0.1}
      particleBaseSize={100}
      moveParticlesOnHover={true}
      alphaParticles={false}
      disableRotation={false}
    />
  )
}
