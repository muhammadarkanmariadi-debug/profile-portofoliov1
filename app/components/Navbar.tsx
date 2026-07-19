'use client'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme, useLanguage } from '../providers'
import { Sun, Moon, Languages } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { lang, t, toggleLanguage } = useLanguage()

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const links = [
    { name: t.navbar.home, href: '/' },
    { name: t.navbar.skills, href: '/#skills' },
    { name: t.navbar.achievements, href: '/#achievements' },
    { name: t.navbar.projects, href: '/projects' },
    { name: t.navbar.contact, href: '/contact' }
  ]

  return (
    <>
      <header className=" fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full">
        <nav className="bg-surface/65 backdrop-blur-xl border border-border rounded-full mt-6 mx-auto w-fit px-6 py-3 shadow-xl shadow-primary/5 flex items-center gap-8 transition-all duration-300">
          <Link href="/" className="  font-heading text-lg font-bold text-on-surface tracking-tight hover:text-primary transition-colors">
            ARKAN.DEV
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`font-mono text-xs uppercase tracking-widest transition-colors duration-300 cursor-target ${
                    isActive ? 'text-primary font-bold' : 'text-on-surface-variant/70 hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-4 border-l border-border pl-4 ml-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-target text-sm font-mono font-bold uppercase"
              title="Toggle Language"
            >
              <Languages size={18} />
              <span>{lang}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-target"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link href="/contact" className="bg-primary text-white px-5 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] active:scale-95 font-bold cursor-target ml-2">
              {t.navbar.hireMe}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3 ml-4">
            <button onClick={toggleLanguage} className="text-on-surface hover:text-primary transition-colors cursor-target font-mono text-xs font-bold uppercase">
              {lang}
            </button>
            <button onClick={toggleTheme} className="text-on-surface hover:text-primary transition-colors cursor-target">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="text-on-surface hover:text-primary transition-colors focus:outline-none cursor-target"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Slide-in Panel */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-surface border-l border-border shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col p-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end mb-12">
          <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
            <X size={28} />
          </button>
        </div>
        
        <div className="flex flex-col gap-8">
          {links.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`font-heading text-2xl font-bold transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
          
          <div className="mt-8 pt-8 border-t border-border">
            <Link 
              href="/contact" 
              onClick={() => setIsOpen(false)}
              className="block w-full bg-primary text-white text-center px-6 py-4 rounded-xl font-heading font-bold text-lg hover:bg-opacity-90 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)]"
            >
              {t.navbar.hireMe}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
