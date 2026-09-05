'use client'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ui/ThemeToggle'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (pathname.startsWith('/admin') || pathname === '/') {
    return null;
  }

  const links = [
    { name: 'WORK', href: '/projects' },
    { name: 'ABOUT', href: '/#about' },
    { name: 'SKILLS', href: '/#skills' },
    { name: 'APPROACH', href: '/#approach' },
    { name: 'CREDENTIALS', href: '/achievements' },
    { name: 'CONTACT', href: '/contact' }
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border px-6 sm:px-10 py-4 transition-all duration-300">
        <div className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em]">
          
          {/* Brand Monogram */}
          <Link href="/" className="font-bold flex items-center gap-2.5 group cursor-target text-text-primary">
            <span className="w-7 h-7 rounded border border-border flex items-center justify-center text-[10px] font-black group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-all">
              4R
            </span>
            <span className="font-extrabold tracking-wider text-sm text-text-primary group-hover:text-primary transition-colors">4RK4N.DEV</span>
          </Link>

          {/* Desktop Nav Links & Controls */}
          <div className="hidden md:flex items-center gap-8 sm:gap-10">
            <nav className="flex items-center gap-8 sm:gap-10 text-text-muted text-xs">
              {links.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`hover:text-text-primary hover:text-primary transition-colors cursor-target font-medium ${
                      isActive ? 'text-text-primary font-bold border-b border-primary pb-0.5' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <ThemeToggle showLabel={false} />
          </div>

          {/* Mobile Menu Actions */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle showLabel={false} />
            <button 
              className="text-text-primary hover:opacity-70 transition-opacity focus:outline-none cursor-target p-1 rounded-md border border-border"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Slide-in Panel */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-surface border-l border-border shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between p-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div>
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-border">
            <span className="font-mono text-xs text-text-muted tracking-widest uppercase">NAVIGATION</span>
            <button onClick={() => setIsOpen(false)} className="text-text-primary hover:opacity-70 transition-opacity p-1">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            {links.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-heading text-2xl font-black transition-colors ${
                    isActive ? 'text-primary' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-muted uppercase tracking-wider">THEME</span>
            <ThemeToggle showLabel={true} />
          </div>

          <Link 
            href="/contact" 
            onClick={() => setIsOpen(false)}
            className="w-full bg-primary text-background text-center py-3.5 rounded-full font-mono text-xs uppercase tracking-wider font-black flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <span>CONTACT</span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar
