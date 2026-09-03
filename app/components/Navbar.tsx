'use client'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    { name: 'CREDENTIALS', href: '/achievements' },
    { name: 'CONTACT', href: '/contact' }
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#EBEBEF]/95 backdrop-blur-md border-b border-[#D8D8E0] px-6 sm:px-10 py-5 transition-all">
        <div className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em]">
          
          {/* Brand Monogram */}
          <Link href="/" className="font-bold flex items-center gap-2.5 group cursor-target text-[#121217]">
            <span className="w-7 h-7 rounded border border-[#121217] flex items-center justify-center text-[10px] font-black group-hover:bg-[#121217] group-hover:text-white transition-colors">
              4R
            </span>
            <span className="font-extrabold tracking-wider text-sm text-[#121217]">4RK4N.DEV</span>
          </Link>

          {/* Desktop Nav Links (Screenshot Match) */}
          <nav className="hidden md:flex items-center gap-8 sm:gap-10 text-[#555566] text-xs">
            {links.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`hover:text-[#121217] transition-colors cursor-target font-medium ${
                    isActive ? 'text-[#121217] font-bold' : ''
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              className="text-[#121217] hover:opacity-70 transition-opacity focus:outline-none cursor-target"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Slide-in Panel */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-[#EBEBEF] border-l border-[#D8D8E0] shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between p-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div>
          <div className="flex items-center justify-between mb-12">
            <span className="font-mono text-xs text-[#707080] tracking-widest uppercase">NAVIGATION</span>
            <button onClick={() => setIsOpen(false)} className="text-[#121217] hover:opacity-70 transition-opacity">
              <X size={22} />
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
                    isActive ? 'text-[#121217]' : 'text-[#707080] hover:text-[#121217]'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-[#D8D8E0]">
          <Link 
            href="/contact" 
            onClick={() => setIsOpen(false)}
            className="w-full bg-[#121217] text-white text-center py-3.5 rounded-full font-mono text-xs uppercase tracking-wider font-black flex items-center justify-center gap-1.5"
          >
            <span>CONTACT</span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar
