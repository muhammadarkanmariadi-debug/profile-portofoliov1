'use client';

import React from 'react';
import Sidebar from '@/app/components/admin/Sidebar';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-panel min-h-screen bg-background text-text-primary flex flex-col md:flex-row font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden md:h-screen md:overflow-y-auto flex flex-col bg-background">
        {/* Top Header Bar */}
        <header className="w-full border-b border-border bg-surface/80 backdrop-blur-md px-6 py-3 flex items-center justify-between font-mono text-xs text-text-muted sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-widest text-[11px] font-bold text-text-primary">CORE ENGINE ONLINE</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle showLabel={false} />
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-text-muted hover:text-text-primary hover:border-primary/50 transition-colors cursor-target text-[11px]"
            >
              <span>VIEW SITE</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
