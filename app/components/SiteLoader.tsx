'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SiteLoader({ onComplete }: { onComplete?: () => void }) {
  const [count, setCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Disable body scroll while loading
    document.body.style.overflow = 'hidden'

    let current = 0
    const interval = setInterval(() => {
      // Accelerate towards 100
      const increment = Math.floor(Math.random() * 8) + 2
      current = Math.min(100, current + increment)
      setCount(current)

      if (current >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsComplete(true)
          document.body.style.overflow = ''
          if (onComplete) onComplete()
        }, 400)
      }
    }, 45)

    return () => {
      clearInterval(interval)
      document.body.style.overflow = ''
    }
  }, [onComplete])

  const formattedCount = String(count).padStart(3, '0')

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          key="site-loader"
          initial={{ y: 0 }}
          exit={{ 
            y: '-100%', 
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-[#0B0B0E] text-[#FAFAFC] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Top Line Meta */}
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-[#8E8E9F]">
            <span>4RK4N.DEV</span>
            <span>DIGITAL EXPERIENCES</span>
          </div>

          {/* Center Giant Wordmark */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center py-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading font-black text-6xl sm:text-8xl md:text-9xl lg:text-[13vw] tracking-tighter leading-none text-[#FAFAFC]"
            >
              4RK4N
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading font-black text-6xl sm:text-8xl md:text-9xl lg:text-[13vw] tracking-tighter leading-none text-[#FAFAFC] self-end sm:self-auto"
            >
              STUDIO
            </motion.div>
          </div>

          {/* Bottom Line & Counter */}
          <div className="flex items-end justify-between font-mono text-xs uppercase tracking-[0.2em] text-[#8E8E9F] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse"></span>
              <span>LOADING EXPERIENCE</span>
            </div>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#FAFAFC] tracking-wider">
              {formattedCount}
            </span>
          </div>

          {/* Progress Hairline */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#22222B]">
            <div 
              className="h-full bg-[#FAFAFC] transition-all duration-75 ease-out origin-left"
              style={{ width: `${count}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
