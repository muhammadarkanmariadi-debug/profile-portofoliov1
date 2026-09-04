'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Loader2, Award } from 'lucide-react';
import type { Achievement } from '@prisma/client';

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/public/achievements');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAchievements(data);
      } else {
        console.error('API Error:', data);
        setAchievements([]);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' });
      setAchievements(achievements.filter(a => a.id !== id));
    } catch (error) {
      alert('Failed to delete achievement');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === achievements.length - 1)
    ) return;

    const newItems = [...achievements];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newItems[index].order;
    const swapOrder = newItems[swapIndex].order;
    
    const actualCurrentOrder = currentOrder === swapOrder ? index : currentOrder;
    const actualSwapOrder = currentOrder === swapOrder ? swapIndex : swapOrder;

    newItems[index].order = actualSwapOrder;
    newItems[swapIndex].order = actualCurrentOrder;

    // Save to DB immediately
    try {
      await Promise.all([
        fetch(`/api/admin/achievements/${newItems[index].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newItems[index] })
        }),
        fetch(`/api/admin/achievements/${newItems[swapIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newItems[swapIndex] })
        })
      ]);
      fetchAchievements();
    } catch (error) {
      console.error('Failed to update order:', error);
      fetchAchievements();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Section Header with Index */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">04</span>
          <span className="text-text-primary font-bold">CREDENTIALS & HONORS REPOSITORY</span>
        </div>
        <Link 
          href="/admin/achievements/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-xl transition-colors font-mono text-xs font-bold cursor-target shadow-md shadow-primary/20"
        >
          <Plus size={15} />
          <span>ADD CREDENTIAL</span>
        </Link>
      </header>

      {/* Achievements Table */}
      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-elevated border-b border-border text-text-muted font-mono text-xs uppercase tracking-wider">
                <th className="p-4 pl-6 w-24">Rank</th>
                <th className="p-4 w-32">Document</th>
                <th className="p-4 min-w-[240px]">Honor & Standing</th>
                <th className="p-4">Date Conferred</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans text-sm">
              {achievements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-text-muted font-mono text-xs">
                    No achievements or credentials found. Add your hackathon wins and certifications.
                  </td>
                </tr>
              ) : (
                achievements.map((item, index) => (
                  <tr key={item.id} className="hover:bg-surface-elevated/60 transition-colors group">
                    <td className="p-4 pl-6 font-mono text-xs text-text-muted">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">#{String(index + 1).padStart(2, '0')}</span>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:text-primary disabled:opacity-20 cursor-target"
                            title="Move Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button 
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === achievements.length - 1}
                            className="p-1 hover:text-primary disabled:opacity-20 cursor-target"
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {item.imageUrl ? (
                         <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-20 h-14 object-cover rounded-xl border border-border shadow-sm" 
                        />
                      ) : (
                        <div className="w-20 h-14 bg-surface-elevated border border-dashed border-border rounded-xl flex items-center justify-center font-mono text-[10px] text-text-muted">
                          NO DOC
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-text-primary mb-1">{item.title}</div>
                      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <Award size={11} />
                        <span>{item.status}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-text-muted">
                      {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/achievements/edit/${item.id}`}
                          className="p-2 bg-surface-elevated hover:bg-primary hover:text-background border border-border text-text-muted rounded-xl transition-all cursor-target"
                          title="Edit achievement"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-surface-elevated hover:bg-rose-500/20 hover:text-rose-400 border border-border text-text-muted rounded-xl transition-all cursor-target"
                          title="Delete achievement"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
