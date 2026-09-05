'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Loader2, 
  GripVertical, 
  LayoutGrid, 
  List, 
  CheckCircle2 
} from 'lucide-react';
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
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Drag-and-drop state per category
  const [dragInfo, setDragInfo] = useState<{ category: string; index: number } | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{ category: string; index: number } | null>(null);

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

  const saveCategorySkillsOrder = async (updatedCategorySkills: Skill[]) => {
    setIsSavingOrder(true);
    try {
      const itemsToUpdate = updatedCategorySkills.map((s, idx) => ({
        id: s.id,
        order: idx + 1,
      }));

      const res = await fetch('/api/admin/skills/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      });

      if (!res.ok) throw new Error('Failed to save skill order');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Error saving reordered skills:', err);
      alert('Failed to save skill order');
      fetchSkills();
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, category: string, index: number) => {
    setDragInfo({ category, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${category}:${index}`);
  };

  const handleDragOver = (e: React.DragEvent, category: string, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragOverInfo || dragOverInfo.category !== category || dragOverInfo.index !== index) {
      setDragOverInfo({ category, index });
    }
  };

  const handleDrop = async (e: React.DragEvent, category: string, targetIndex: number) => {
    e.preventDefault();
    if (!dragInfo || dragInfo.category !== category || dragInfo.index === targetIndex) {
      setDragInfo(null);
      setDragOverInfo(null);
      return;
    }

    const categoryList = skills.filter(s => s.category === category).sort((a, b) => a.order - b.order);
    const updatedCategory = [...categoryList];
    const [moved] = updatedCategory.splice(dragInfo.index, 1);
    updatedCategory.splice(targetIndex, 0, moved);

    const normalizedCategory = updatedCategory.map((s, idx) => ({
      ...s,
      order: idx + 1,
    }));

    // Update global skills state
    const remaining = skills.filter(s => s.category !== category);
    setSkills([...remaining, ...normalizedCategory]);

    setDragInfo(null);
    setDragOverInfo(null);

    await saveCategorySkillsOrder(normalizedCategory);
  };

  const handleDragEnd = () => {
    setDragInfo(null);
    setDragOverInfo(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down', groupSkills: Skill[]) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === groupSkills.length - 1)
    ) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedCategory = [...groupSkills];
    const [moved] = updatedCategory.splice(index, 1);
    updatedCategory.splice(targetIndex, 0, moved);

    const normalizedCategory = updatedCategory.map((s, idx) => ({
      ...s,
      order: idx + 1,
    }));

    const category = groupSkills[0]?.category;
    const remaining = skills.filter(s => s.category !== category);
    setSkills([...remaining, ...normalizedCategory]);

    await saveCategorySkillsOrder(normalizedCategory);
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
      
      {/* Section Header with Index & View Controls */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">03</span>
          <span className="text-text-primary font-bold">TECHNICAL SKILLS & TOOLING MATRIX</span>
        </div>

        <div className="flex items-center gap-3">
          {isSavingOrder && (
            <div className="flex items-center gap-1.5 text-primary text-xs font-mono font-bold animate-pulse">
              <Loader2 size={13} className="animate-spin" />
              <span>SAVING ORDER...</span>
            </div>
          )}
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold">
              <CheckCircle2 size={14} />
              <span>ORDER SAVED</span>
            </div>
          )}

          <div className="flex items-center bg-surface border border-border rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-target ${viewMode === 'cards' ? 'bg-primary text-background font-bold' : 'text-text-muted hover:text-text-primary'}`}
              title="Card Drag & Drop View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-target ${viewMode === 'table' ? 'bg-primary text-background font-bold' : 'text-text-muted hover:text-text-primary'}`}
              title="Table View"
            >
              <List size={15} />
            </button>
          </div>

          <Link 
            href="/admin/skills/create"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-xl transition-colors font-mono text-xs font-bold cursor-target shadow-md shadow-primary/20"
          >
            <Plus size={15} />
            <span>ADD SKILL</span>
          </Link>
        </div>
      </header>

      {/* Helper Tip */}
      <div className="w-full bg-surface-elevated/70 border border-border/80 rounded-2xl px-5 py-3 flex items-center justify-between font-mono text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-primary" />
          <span>Tip: Drag and drop skill cards within any category to customize the skill ticker and grid ordering.</span>
        </div>
        <span className="font-bold text-text-primary">{skills.length} Total Skills</span>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-text-muted py-16 bg-surface rounded-3xl border border-border font-mono text-xs">
          No skills found in registry. Click &quot;ADD SKILL&quot; to initialize your tool stack.
        </div>
      ) : (
        <div className="space-y-10">
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
                
                {viewMode === 'cards' ? (
                  /* Cards View */
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {groupSkills.map((item, index) => {
                      const isDragging = dragInfo?.category === category && dragInfo.index === index;
                      const isOver = dragOverInfo?.category === category && dragOverInfo.index === index;

                      return (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, category, index)}
                          onDragOver={(e) => handleDragOver(e, category, index)}
                          onDrop={(e) => handleDrop(e, category, index)}
                          onDragEnd={handleDragEnd}
                          className={`group relative bg-surface-elevated border rounded-2xl p-3.5 flex flex-col items-center text-center justify-between transition-all cursor-grab active:cursor-grabbing ${
                            isDragging ? 'opacity-30 scale-90 border-primary' : 'border-border hover:border-primary/50'
                          } ${isOver && !isDragging ? 'ring-2 ring-primary border-primary' : ''}`}
                        >
                          <div className="w-full flex items-center justify-between text-text-muted mb-2">
                            <GripVertical size={14} className="group-hover:text-primary transition-colors cursor-grab" />
                            <span className="font-mono text-[10px] font-bold">#{index + 1}</span>
                          </div>

                          <div className="w-12 h-12 rounded-xl bg-background border border-border p-2 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            {item.logoUrl ? (
                              <img src={item.logoUrl} alt={item.title} className="w-full h-full object-contain" />
                            ) : (
                              <span className="font-mono font-black text-sm text-primary">{item.title.charAt(0)}</span>
                            )}
                          </div>

                          <div className="font-bold text-xs text-text-primary truncate w-full mb-3">
                            {item.title}
                          </div>

                          <div className="flex items-center gap-1 w-full justify-center pt-2 border-t border-border/60">
                            <Link
                              href={`/admin/skills/edit/${item.id}`}
                              className="p-1.5 hover:text-primary transition-colors text-text-muted"
                              title="Edit Skill"
                            >
                              <Pencil size={13} />
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 hover:text-rose-400 transition-colors text-text-muted"
                              title="Delete Skill"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Table List View */
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-text-muted font-mono text-xs uppercase">
                        <th className="p-4 pl-6 w-28">Drag / Rank</th>
                        <th className="p-4 w-20">Badge</th>
                        <th className="p-4">Technology Title</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-sans text-sm">
                      {groupSkills.map((item, index) => {
                        const isDragging = dragInfo?.category === category && dragInfo.index === index;
                        const isOver = dragOverInfo?.category === category && dragOverInfo.index === index;

                        return (
                          <tr 
                            key={item.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, category, index)}
                            onDragOver={(e) => handleDragOver(e, category, index)}
                            onDrop={(e) => handleDrop(e, category, index)}
                            onDragEnd={handleDragEnd}
                            className={`hover:bg-surface-elevated/60 transition-colors group cursor-grab active:cursor-grabbing ${
                              isDragging ? 'opacity-30 bg-primary/10' : ''
                            } ${isOver && !isDragging ? 'bg-primary/20 border-t-2 border-primary' : ''}`}
                          >
                            <td className="p-4 pl-6 font-mono text-xs text-text-muted">
                              <div className="flex items-center gap-2">
                                <GripVertical size={16} className="text-text-muted group-hover:text-primary transition-colors cursor-grab" />
                                <span className="font-bold">#{index + 1}</span>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-1">
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
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
