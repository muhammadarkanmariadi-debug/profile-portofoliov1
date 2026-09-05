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
  Award, 
  GripVertical, 
  LayoutGrid, 
  List, 
  CheckCircle2 
} from 'lucide-react';
import type { Achievement } from '@prisma/client';
import { getOptimizedImageUrl } from '@/lib/utils/image';

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  const saveReorderedAchievements = async (reorderedList: Achievement[]) => {
    setIsSavingOrder(true);
    try {
      const itemsToUpdate = reorderedList.map((a, idx) => ({
        id: a.id,
        order: idx + 1,
      }));

      const res = await fetch('/api/admin/achievements/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      });

      if (!res.ok) throw new Error('Failed to save achievement order');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Error saving achievement order:', err);
      alert('Failed to save achievement order');
      fetchAchievements();
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...achievements];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, moved);

    const normalized = updated.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setAchievements(normalized);
    setDraggedIndex(null);
    setDragOverIndex(null);

    await saveReorderedAchievements(normalized);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === achievements.length - 1)
    ) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...achievements];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const normalized = updated.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setAchievements(normalized);
    await saveReorderedAchievements(normalized);
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
      
      {/* Section Header with Index & Controls */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">04</span>
          <span className="text-text-primary font-bold">CREDENTIALS & HONORS REPOSITORY</span>
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
            href="/admin/achievements/create"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-xl transition-colors font-mono text-xs font-bold cursor-target shadow-md shadow-primary/20"
          >
            <Plus size={15} />
            <span>ADD CREDENTIAL</span>
          </Link>
        </div>
      </header>

      {/* Helper Tip */}
      <div className="w-full bg-surface-elevated/70 border border-border/80 rounded-2xl px-5 py-3 flex items-center justify-between font-mono text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-primary" />
          <span>Tip: Drag and drop credential cards to reorder your achievements, hackathon prizes, and certificates.</span>
        </div>
        <span className="font-bold text-text-primary">{achievements.length} Credentials</span>
      </div>

      {achievements.length === 0 ? (
        <div className="bg-surface border border-border rounded-3xl p-12 text-center text-text-muted font-mono text-xs">
          No achievements or credentials found. Add your hackathon wins and certifications.
        </div>
      ) : viewMode === 'cards' ? (
        /* 1. Drag and Drop Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, index) => {
            const isDragging = draggedIndex === index;
            const isOver = dragOverIndex === index;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative bg-surface border rounded-3xl overflow-hidden p-5 flex flex-col justify-between transition-all duration-200 cursor-grab active:cursor-grabbing ${
                  isDragging ? 'opacity-40 scale-95 border-primary shadow-2xl' : 'border-border hover:border-primary/50 shadow-sm'
                } ${isOver && !isDragging ? 'ring-2 ring-primary ring-offset-2 ring-offset-background border-primary' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-text-muted group-hover:text-primary transition-colors p-1 -ml-1">
                        <GripVertical size={18} />
                      </div>
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-full bg-surface-elevated border border-border text-primary">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-text-muted hover:text-primary disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === achievements.length - 1}
                        className="p-1 text-text-muted hover:text-primary disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Certificate Image Preview */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-elevated border border-border mb-4">
                    {item.imageUrl ? (
                      <img
                        src={getOptimizedImageUrl(item.imageUrl)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-text-muted">
                        NO DOCUMENT PREVIEW
                      </div>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-text-primary line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full mb-3">
                    <Award size={12} />
                    <span className="truncate">{item.status}</span>
                  </div>

                  <p className="text-text-muted text-xs font-sans line-clamp-2 leading-relaxed mb-3">
                    {item.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/80 flex items-center justify-between font-mono text-xs text-text-muted">
                  <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/achievements/edit/${item.id}`}
                      className="p-2 bg-surface-elevated hover:bg-primary hover:text-background border border-border text-text-muted rounded-xl transition-all cursor-target"
                      title="Edit Achievement"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-surface-elevated hover:bg-rose-500/20 hover:text-rose-400 border border-border text-text-muted rounded-xl transition-all cursor-target"
                      title="Delete Achievement"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. Table List View */
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-elevated border-b border-border text-text-muted font-mono text-xs uppercase tracking-wider">
                  <th className="p-4 pl-6 w-28">Drag / Rank</th>
                  <th className="p-4 w-32">Document</th>
                  <th className="p-4 min-w-[240px]">Honor & Standing</th>
                  <th className="p-4">Date Conferred</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans text-sm">
                {achievements.map((item, index) => {
                  const isDragging = draggedIndex === index;
                  const isOver = dragOverIndex === index;

                  return (
                    <tr
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`hover:bg-surface-elevated/60 transition-colors group cursor-grab active:cursor-grabbing ${
                        isDragging ? 'opacity-30 bg-primary/10' : ''
                      } ${isOver && !isDragging ? 'bg-primary/20 border-t-2 border-primary' : ''}`}
                    >
                      <td className="p-4 pl-6 font-mono text-xs text-text-muted">
                        <div className="flex items-center gap-2">
                          <GripVertical size={16} className="text-text-muted group-hover:text-primary transition-colors cursor-grab" />
                          <span className="font-bold">#{String(index + 1).padStart(2, '0')}</span>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-1">
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
                            src={getOptimizedImageUrl(item.imageUrl)} 
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
