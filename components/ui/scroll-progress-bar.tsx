'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!barRef.current) return

    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 'top top',
          end: 'max',
          scrub: 0.2,
          invalidateOnRefresh: true,
        },
      }
    )
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[99999] pointer-events-none bg-transparent">
      <div
        ref={barRef}
        className="w-full h-full bg-primary origin-left shadow-[0_0_10px_rgba(56,189,248,0.7)] will-change-transform"
      />
    </div>
  )
}
