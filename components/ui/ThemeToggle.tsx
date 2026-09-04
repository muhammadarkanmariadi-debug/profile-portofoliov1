'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/app/providers'

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`group relative flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-full border border-border bg-surface hover:border-primary/40 hover:bg-surface-elevated transition-all duration-200 cursor-target focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ y: -10, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 10, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
              className="text-primary flex items-center justify-center"
            >
              <Moon size={14} className="stroke-[2.2]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: -10, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 10, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
              className="text-amber-500 flex items-center justify-center"
            >
              <Sun size={14} className="stroke-[2.2]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted group-hover:text-text-primary transition-colors">
          {isDark ? 'DARK' : 'LIGHT'}
        </span>
      )}
    </button>
  )
}

export default ThemeToggle
