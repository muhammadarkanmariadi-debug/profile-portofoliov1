'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language } from '@/lib/i18n'

// --- Theme Context ---
export type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {}
})

export const useTheme = () => useContext(ThemeContext)

// --- Language Context ---
const LanguageContext = createContext<{
  lang: Language;
  t: typeof translations['en'];
  toggleLanguage: () => void;
}>({
  lang: 'en',
  t: translations['en'],
  toggleLanguage: () => {}
})

export const useLanguage = () => useContext(LanguageContext)

import { SmoothScrollProvider } from './providers/SmoothScrollProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [lang, setLang] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
    } else {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      const defaultTheme: Theme = prefersLight ? 'light' : 'dark'
      setThemeState(defaultTheme)
      applyTheme(defaultTheme)
    }
    
    // Load language (default to en)
    const savedLang = localStorage.getItem('lang') as Language | null
    if (savedLang === 'en' || savedLang === 'id') {
      setLang(savedLang)
    } else {
      setLang('en')
    }
  }, [])

  const applyTheme = (targetTheme: Theme) => {
    const root = document.documentElement
    if (targetTheme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'id' : 'en'
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }
  
  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-background opacity-0"></div>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLanguage }}>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  )
}
