'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  History,
  Code2,
  Briefcase,
  Trophy,
  LogOut,
  Menu,
  X,
  Mail,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

const navItems = [
  { index: '00', name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { index: '01', name: 'Profile & Bio', href: '/admin/profile', icon: User },
  { index: '02', name: 'Projects', href: '/admin/projects', icon: Briefcase },
  { index: '03', name: 'Tech Skills', href: '/admin/skills', icon: Code2 },
  { index: '04', name: 'Achievements', href: '/admin/achievements', icon: Trophy },
  { index: '05', name: 'Timeline', href: '/admin/timeline', icon: History },
  { index: '06', name: 'Inbox & Messages', href: '/admin/messages', icon: Mail },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith('/admin/login')) {
    return null;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-3 right-4 z-50 p-2.5 bg-surface border border-border rounded-xl text-text-primary shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle admin navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-72 bg-surface border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col h-screen select-none
        `}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-border flex items-center justify-center font-mono font-bold text-sm text-primary group-hover:border-primary/50 transition-colors">
              4R
            </div>
            <div>
              <div className="font-heading font-black text-base tracking-tight text-text-primary">
                4RK4N.DEV
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                CONSOLE // ADMIN
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1.5 font-mono text-xs">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-[0.25em] text-text-muted font-bold">
            SYSTEM INDEX
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 cursor-target group
                  ${
                    isActive
                      ? 'bg-primary text-background font-bold shadow-md shadow-primary/20'
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={
                      isActive
                        ? 'text-background'
                        : 'text-text-muted group-hover:text-primary transition-colors'
                    }
                  />
                  <span className="tracking-wider uppercase text-[11px]">{item.name}</span>
                </div>
                <span
                  className={`text-[10px] opacity-60 font-bold ${
                    isActive ? 'text-background' : 'text-text-muted'
                  }`}
                >
                  [{item.index}]
                </span>
              </Link>
            );
          })}
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors text-[11px] font-mono cursor-target"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={14} />
              <span>LIVE PORTFOLIO</span>
            </div>
            <span>↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2.5 w-full rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-[11px] font-mono font-bold cursor-target"
          >
            <LogOut size={15} />
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </aside>
    </>
  );
}
