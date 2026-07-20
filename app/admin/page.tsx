'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Code2, Award, MessageSquare, Loader2 } from 'lucide-react';
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const statCards = [
    { title: 'Total Projects', value: stats?.totalProjects || 0, icon: <Briefcase className="text-blue-400" size={24} />, href: '/admin/projects' },
    { title: 'Total Skills', value: stats?.totalSkills || 0, icon: <Code2 className="text-green-400" size={24} />, href: '/admin/skills' },
    { title: 'Achievements', value: stats?.totalAchievements || 0, icon: <Award className="text-yellow-400" size={24} />, href: '/admin/achievements' },
    { 
      title: 'Messages', 
      value: stats?.totalMessages || 0, 
      subtitle: stats?.unreadMessages ? `${stats.unreadMessages} unread` : 'All read',
      icon: <MessageSquare className="text-purple-400" size={24} />, 
      href: '/admin/messages' 
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Overview of your portfolio&apos;s content and activity.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <Link key={idx} href={card.href} className="block group">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors h-full flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    {card.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
                  <p className="text-gray-400 font-medium">{card.title}</p>
                  {card.subtitle && (
                    <p className={`text-sm mt-1 ${stats?.unreadMessages ? 'text-primary' : 'text-gray-500'}`}>
                      {card.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-4">Note on Visitor Statistics</h2>
        <p className="text-gray-400 leading-relaxed">
          Currently, there is no built-in database table to track raw website visitors. If you would like to track visitors, it is highly recommended to integrate an analytics service such as <strong>Vercel Analytics</strong> or <strong>Google Analytics</strong>, which provides much more detailed insights (geography, devices, active time) than a simple database counter.
        </p>
      </div>
    </div>
  );
}
