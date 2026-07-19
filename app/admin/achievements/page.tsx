'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import type { Achievement } from '@prisma/client';

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/public/achievements');
      const data = await res.json();
      setAchievements(data);
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Achievements Management</h1>
        <Link 
          href="/admin/achievements/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={20} />
          Add Achievement
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/10 text-gray-400 text-sm">
              <th className="p-4 font-medium w-24">Order</th>
              <th className="p-4 font-medium w-32">Image</th>
              <th className="p-4 font-medium min-w-[200px]">Details</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {achievements.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No achievements found.
                </td>
              </tr>
            ) : (
              achievements.map((item, index) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === achievements.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.titleEn} className="w-24 h-16 object-cover rounded-lg border border-white/10" />
                    ) : (
                      <div className="w-24 h-16 bg-white/5 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-xs text-gray-500">No Image</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white mb-1">{item.titleEn}</div>
                    <div className="text-sm text-primary/80">{item.statusEn}</div>
                  </td>
                  <td className="p-4 text-gray-300">
                    {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/achievements/edit/${item.id}`}
                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
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
  );
}
