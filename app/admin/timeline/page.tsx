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
  Briefcase, 
  GraduationCap, 
  GripVertical, 
  CheckCircle2 
} from 'lucide-react';
import type { TimelineEntry } from '@prisma/client';

export default function TimelineAdminPage() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Drag and drop state per section
  const [dragInfo, setDragInfo] = useState<{ type: string; index: number } | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{ type: string; index: number } | null>(null);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/public/timeline');
      const data = await res.json();
      if (Array.isArray(data)) {
        setEntries(data);
      } else {
        console.error('API Error:', data);
        setEntries([]);
      }
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      await fetch(`/api/admin/timeline/${id}`, { method: 'DELETE' });
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      alert('Failed to delete entry');
    }
  };

  const saveTimelineOrder = async (updatedTypeEntries: TimelineEntry[]) => {
    setIsSavingOrder(true);
    try {
      const itemsToUpdate = updatedTypeEntries.map((e, idx) => ({
        id: e.id,
        order: idx + 1,
      }));

      const res = await fetch('/api/admin/timeline/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      });

      if (!res.ok) throw new Error('Failed to save timeline order');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Error saving timeline order:', err);
      alert('Failed to save timeline order');
      fetchEntries();
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, type: string, index: number) => {
    setDragInfo({ type, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${type}:${index}`);
  };

  const handleDragOver = (e: React.DragEvent, type: string, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragOverInfo || dragOverInfo.type !== type || dragOverInfo.index !== index) {
      setDragOverInfo({ type, index });
    }
  };

  const handleDrop = async (e: React.DragEvent, type: string, targetIndex: number) => {
    e.preventDefault();
    if (!dragInfo || dragInfo.type !== type || dragInfo.index === targetIndex) {
      setDragInfo(null);
      setDragOverInfo(null);
      return;
    }

    const typeList = entries.filter(e => e.type === type).sort((a, b) => a.order - b.order);
    const updated = [...typeList];
    const [moved] = updated.splice(dragInfo.index, 1);
    updated.splice(targetIndex, 0, moved);

    const normalized = updated.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    const remaining = entries.filter(e => e.type !== type);
    setEntries([...remaining, ...normalized]);

    setDragInfo(null);
    setDragOverInfo(null);

    await saveTimelineOrder(normalized);
  };

  const handleDragEnd = () => {
    setDragInfo(null);
    setDragOverInfo(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down', groupEntries: TimelineEntry[]) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === groupEntries.length - 1)
    ) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...groupEntries];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const normalized = updated.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    const type = groupEntries[0]?.type;
    const remaining = entries.filter(e => e.type !== type);
    setEntries([...remaining, ...normalized]);

    await saveTimelineOrder(normalized);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const education = entries.filter(e => e.type === 'EDUCATION').sort((a, b) => a.order - b.order);
  const experience = entries.filter(e => e.type === 'EXPERIENCE').sort((a, b) => a.order - b.order);

  const renderSection = (data: TimelineEntry[], title: string, type: 'EXPERIENCE' | 'EDUCATION', icon: React.ReactNode) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-text-primary font-bold">
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
          <span className="text-text-muted font-normal">({data.length})</span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-elevated border-b border-border text-text-muted font-mono text-xs uppercase">
              <th className="p-4 pl-6 w-28">Drag / Rank</th>
              <th className="p-4 min-w-[220px]">Role / Degree</th>
              <th className="p-4">Organization / Period</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-sans text-sm">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted font-mono text-xs">
                  No {title.toLowerCase()} entries found.
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isDragging = dragInfo?.type === type && dragInfo.index === index;
                const isOver = dragOverInfo?.type === type && dragOverInfo.index === index;

                return (
                  <tr
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, type, index)}
                    onDragOver={(e) => handleDragOver(e, type, index)}
                    onDrop={(e) => handleDrop(e, type, index)}
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
                            onClick={() => handleMove(index, 'up', data)}
                            disabled={index === 0}
                            className="p-1 hover:text-primary disabled:opacity-20 cursor-target"
                            title="Move Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button 
                            onClick={() => handleMove(index, 'down', data)}
                            disabled={index === data.length - 1}
                            className="p-1 hover:text-primary disabled:opacity-20 cursor-target"
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-text-primary">
                      {item.title}
                    </td>
                    <td className="p-4 font-mono text-xs text-primary">
                      {item.category}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/timeline/edit/${item.id}`}
                          className="p-2 bg-surface-elevated hover:bg-primary hover:text-background border border-border text-text-muted rounded-xl transition-all cursor-target"
                          title="Edit entry"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-surface-elevated hover:bg-rose-500/20 hover:text-rose-400 border border-border text-text-muted rounded-xl transition-all cursor-target"
                          title="Delete entry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Section Header with Index & Status */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">05</span>
          <span className="text-text-primary font-bold">CAREER & EDUCATION TIMELINE</span>
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

          <Link 
            href="/admin/timeline/create"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-xl transition-colors font-mono text-xs font-bold cursor-target shadow-md shadow-primary/20"
          >
            <Plus size={15} />
            <span>ADD ENTRY</span>
          </Link>
        </div>
      </header>

      {/* Helper Tip */}
      <div className="w-full bg-surface-elevated/70 border border-border/80 rounded-2xl px-5 py-3 flex items-center justify-between font-mono text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-primary" />
          <span>Tip: Drag and drop rows in Work Experience or Academic Background to customize the timeline chronological order.</span>
        </div>
        <span className="font-bold text-text-primary">{entries.length} Total Entries</span>
      </div>

      <div className="space-y-10">
        {renderSection(experience, 'Work Experience', 'EXPERIENCE', <Briefcase size={15} className="text-primary" />)}
        {renderSection(education, 'Academic Background', 'EDUCATION', <GraduationCap size={15} className="text-secondary" />)}
      </div>
    </div>
  );
}
