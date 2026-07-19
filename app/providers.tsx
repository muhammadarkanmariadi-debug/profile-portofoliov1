'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language } from '@/lib/i18n'

// --- Theme Context ---
type Theme = 'dark' | 'light'

const ThemeContext = createContext<{theme: Theme, toggleTheme: () => void}>({ theme: 'dark', toggleTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)

// --- Language Context ---
const LanguageContext = createContext<{
  lang: Language;
  t: typeof translations['en'];
  toggleLanguage: () => void;
}>({
  lang: 'id',
  t: translations['id'],
  toggleLanguage: () => {}
})

export const useLanguage = () => useContext(LanguageContext)

// --- Providers Wrapper ---
export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark')
  const [lang, setLang] = useState<Language>('id')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    // Load theme
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('light', savedTheme === 'light')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      document.documentElement.classList.add('dark') // Default
    }
    
    // Load language
    const savedLang = localStorage.getItem('lang') as Language | null
    if (savedLang) {
      setLang(savedLang)
    }
  }, [])
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('light', newTheme === 'light')
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
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
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLanguage }}>
        {children}
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  )
}
