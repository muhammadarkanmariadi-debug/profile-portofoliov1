'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import type { Skill } from '@prisma/client';

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/public/skills');
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      alert('Failed to delete skill');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down', groupSkills: Skill[]) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === groupSkills.length - 1)
    ) return;

    const newGroup = [...groupSkills];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newGroup[index].order;
    const swapOrder = newGroup[swapIndex].order;
    
    const actualCurrentOrder = currentOrder === swapOrder ? index : currentOrder;
    const actualSwapOrder = currentOrder === swapOrder ? swapIndex : swapOrder;

    newGroup[index].order = actualSwapOrder;
    newGroup[swapIndex].order = actualCurrentOrder;

    // Save to DB immediately
    try {
      await Promise.all([
        fetch(`/api/admin/skills/${newGroup[index].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newGroup[index] })
        }),
        fetch(`/api/admin/skills/${newGroup[swapIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newGroup[swapIndex] })
        })
      ]);
      fetchSkills(); // Refetch all to keep global state in sync
    } catch (error) {
      console.error('Failed to update order:', error);
      fetchSkills(); // Revert on failure
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = Object.keys(groupedSkills).sort();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Skills Management</h1>
        <Link 
          href="/admin/skills/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={20} />
          Add Skill
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white/5 rounded-2xl border border-white/10">
          No skills found. Add some to get started!
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const groupSkills = groupedSkills[category].sort((a, b) => a.order - b.order);

            return (
              <div key={category} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 bg-white/[0.02] border-b border-white/10 font-semibold text-primary tracking-wider">
                  {category.replace(/_/g, ' ')}
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.01] border-b border-white/10 text-gray-400 text-sm">
                      <th className="p-4 font-medium w-24">Order</th>
                      <th className="p-4 font-medium w-16">Icon</th>
                      <th className="p-4 font-medium">Title</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupSkills.map((item, index) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleMove(index, 'up', groupSkills)}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button 
                              onClick={() => handleMove(index, 'down', groupSkills)}
                              disabled={index === groupSkills.length - 1}
                              className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          {item.logoUrl ? (
                            <img src={item.logoUrl} alt={item.title} className="w-8 h-8 object-contain rounded-md" />
                          ) : (
                            <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center text-xs text-gray-500">?</div>
                          )}
                        </td>
                        <td className="p-4 font-medium text-white">{item.title}</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Link 
                              href={`/admin/skills/edit/${item.id}`}
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
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
