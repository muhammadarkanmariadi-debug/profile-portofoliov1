'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Code2, 
  Award, 
  MessageSquare, 
  Loader2, 
  ArrowUpRight, 
  User, 
  History, 
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalAchievements: number;
  totalMessages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      index: '01',
      title: 'Active Projects',
      value: stats?.totalProjects || 0,
      description: 'Repositories & showcased systems',
      icon: Briefcase,
      color: 'text-primary',
      href: '/admin/projects',
    },
    {
      index: '02',
      title: 'Technical Skills',
      value: stats?.totalSkills || 0,
      description: 'Categorized languages & tools',
      icon: Code2,
      color: 'text-emerald-400',
      href: '/admin/skills',
    },
    {
      index: '03',
      title: 'Credentials & Honors',
      value: stats?.totalAchievements || 0,
      description: 'Verified competitions & certs',
      icon: Award,
      color: 'text-amber-400',
      href: '/admin/achievements',
    },
    {
      index: '04',
      title: 'Inquiries & Messages',
      value: stats?.totalMessages || 0,
      badge: stats?.unreadMessages ? `${stats.unreadMessages} NEW` : 'CLEARED',
      description: 'Contact form submissions',
      icon: MessageSquare,
      color: 'text-secondary',
      href: '/admin/messages',
    },
  ];

  const quickActions = [
    { title: 'New Project', href: '/admin/projects/create', icon: Briefcase, desc: 'Add repository or client case' },
    { title: 'Add Skill', href: '/admin/skills/create', icon: Code2, desc: 'Insert tool into technical matrix' },
    { title: 'New Credential', href: '/admin/achievements/create', icon: Award, desc: 'Document certificate or award' },
    { title: 'Edit Bio & CV', href: '/admin/profile', icon: User, desc: 'Update profile and contact links' },
  ];

  return (
    <div className="space-y-10">
      
      {/* Editorial Section Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">00</span>
          <span className="text-text-primary font-bold">SYSTEM DASHBOARD & METRICS</span>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <Activity size={14} className="text-emerald-400" />
          <span>PRODUCTION CLUSTER ONLINE</span>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-surface border border-border p-8 sm:p-10 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 font-heading font-black text-[16vw] text-text-primary opacity-[0.02] leading-none pointer-events-none">
          CORE
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
            <Sparkles size={13} />
            <span>EXECUTIVE CONSOLE</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-text-primary tracking-tight">
            Portfolio Overview
          </h1>
          <p className="font-sans text-sm sm:text-base text-text-muted leading-relaxed">
            Manage your real-time projects, technical stack, verified credentials, and incoming inquiries from a single consolidated terminal.
          </p>
        </div>
      </div>

      {/* Key Metric Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48 bg-surface rounded-3xl border border-border">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.index} href={card.href} className="group block">
                <div className="h-full bg-surface border border-border hover:border-primary/50 hover:bg-surface-elevated rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm cursor-target transform-gpu">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-text-muted font-bold">[{card.index}]</span>
                      <div className="w-10 h-10 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon size={18} className={card.color} />
                      </div>
                    </div>

                    <div className="font-heading font-black text-4xl text-text-primary tracking-tight mb-1">
                      {card.value}
                    </div>
                    <div className="font-sans font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                      {card.title}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-text-muted">
                    <span className="truncate pr-2">{card.description}</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Launchpad & Shortcuts */}
      <div className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted font-bold flex items-center gap-2">
          <Layers size={14} className="text-primary" />
          <span>QUICK ACTIONS & SHORTCUTS</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                href={action.href}
                className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:bg-surface-elevated transition-all flex items-start gap-4 cursor-target group"
              >
                <div className="p-2.5 rounded-xl bg-surface-elevated border border-border text-primary group-hover:bg-primary group-hover:text-background transition-colors flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="font-sans font-bold text-sm text-text-primary group-hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>{action.title}</span>
                    <ArrowUpRight size={13} />
                  </div>
                  <p className="font-sans text-xs text-text-muted mt-0.5 leading-snug">
                    {action.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
