'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import type { Skill } from '@prisma/client';

const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  FRONTEND: 'FRONTEND',
  BACKEND: 'BACKEND',
  DATABASE_ORM: 'DATABASE & ORM',
  BAHASA_LAINNYA: 'OTHER LANGUAGES',
  VERSION_CONTROL: 'VERSION CONTROL',
  CLOUD_DEPLOYMENT: 'CLOUD & DEPLOYMENT',
  DESIGN_PROTOTYPING: 'DESIGN & PROTOTYPING',
  SISTEM_OPERASI: 'OPERATING SYSTEMS',
};

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/public/skills');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSkills(data);
      } else {
        console.error('API Error:', data);
        setSkills([]);
      }
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
      fetchSkills();
    } catch (error) {
      console.error('Failed to update order:', error);
      fetchSkills();
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
    <div className="space-y-8">
      
      {/* Section Header with Index */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">03</span>
          <span className="text-text-primary font-bold">TECHNICAL SKILLS & TOOLING MATRIX</span>
        </div>
        <Link 
          href="/admin/skills/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-xl transition-colors font-mono text-xs font-bold cursor-target shadow-md shadow-primary/20"
        >
          <Plus size={15} />
          <span>ADD SKILL</span>
        </Link>
      </header>

      {categories.length === 0 ? (
        <div className="text-center text-text-muted py-16 bg-surface rounded-3xl border border-border font-mono text-xs">
          No skills found in registry. Click &quot;ADD SKILL&quot; to initialize your tool stack.
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const groupSkills = groupedSkills[category].sort((a, b) => a.order - b.order);
            const categoryLabel = CATEGORY_DISPLAY_MAP[category] || category.replace(/_/g, ' ');

            return (
              <div key={category} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 px-6 bg-surface-elevated border-b border-border flex items-center justify-between font-mono text-xs tracking-wider text-text-primary font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">▸</span>
                    <span>{categoryLabel}</span>
                  </div>
                  <span className="text-text-muted text-[11px]">
                    {groupSkills.length} {groupSkills.length === 1 ? 'ITEM' : 'ITEMS'}
                  </span>
                </div>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-muted font-mono text-xs uppercase">
                      <th className="p-4 pl-6 w-20">Order</th>
                      <th className="p-4 w-20">Badge</th>
                      <th className="p-4">Technology Title</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-sans text-sm">
                    {groupSkills.map((item, index) => (
                      <tr key={item.id} className="hover:bg-surface-elevated/60 transition-colors group">
                        <td className="p-4 pl-6 font-mono text-xs text-text-muted">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">#{index + 1}</span>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleMove(index, 'up', groupSkills)}
                                disabled={index === 0}
                                className="p-1 hover:text-primary disabled:opacity-20 cursor-target"
                                title="Move Up"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button 
                                onClick={() => handleMove(index, 'down', groupSkills)}
                                disabled={index === groupSkills.length - 1}
                                className="p-1 hover:text-primary disabled:opacity-20 cursor-target"
                                title="Move Down"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {item.logoUrl ? (
                            <img src={item.logoUrl} alt={item.title} className="w-8 h-8 object-contain rounded-lg p-1 bg-surface-elevated border border-border" />
                          ) : (
                            <div className="w-8 h-8 bg-surface-elevated border border-border rounded-lg flex items-center justify-center font-mono font-bold text-xs text-primary">
                              {item.title.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-bold text-text-primary">
                          {item.title}
                        </td>
                        <td className="p-4 pr-6">
                          <div className="flex justify-end gap-2">
                            <Link 
                              href={`/admin/skills/edit/${item.id}`}
                              className="p-2 bg-surface-elevated hover:bg-primary hover:text-background border border-border text-text-muted rounded-xl transition-all cursor-target"
                              title="Edit skill"
                            >
                              <Pencil size={15} />
                            </Link>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 bg-surface-elevated hover:bg-rose-500/20 hover:text-rose-400 border border-border text-text-muted rounded-xl transition-all cursor-target"
                              title="Delete skill"
                            >
                              <Trash2 size={15} />
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
