'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Loader2, Briefcase, GraduationCap } from 'lucide-react';
import type { TimelineEntry } from '@prisma/client';

export default function TimelineAdminPage() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === entries.length - 1)
    ) return;

    const newEntries = [...entries];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newEntries[index].order;
    const swapOrder = newEntries[swapIndex].order;
    
    const actualCurrentOrder = currentOrder === swapOrder ? index : currentOrder;
    const actualSwapOrder = currentOrder === swapOrder ? swapIndex : swapOrder;

    newEntries[index].order = actualSwapOrder;
    newEntries[swapIndex].order = actualCurrentOrder;

    newEntries.sort((a, b) => a.order - b.order);
    setEntries(newEntries);

    try {
      await Promise.all([
        fetch(`/api/admin/timeline/${newEntries[index].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newEntries[index] })
        }),
        fetch(`/api/admin/timeline/${newEntries[swapIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newEntries[swapIndex] })
        })
      ]);
    } catch (error) {
      console.error('Failed to update order:', error);
      fetchEntries();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const education = entries.filter(e => e.type === 'EDUCATION');
  const experience = entries.filter(e => e.type === 'EXPERIENCE');

  const renderTable = (data: TimelineEntry[], title: string, icon: React.ReactNode) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold">
        {icon}
        <span>{title}</span>
        <span className="text-text-muted font-normal">({data.length})</span>
      </div>

      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-elevated border-b border-border text-text-muted font-mono text-xs uppercase">
              <th className="p-4 pl-6 w-24">Order</th>
              <th className="p-4 min-w-[200px]">Role / Degree</th>
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
              data.map((item) => (
                <tr key={item.id} className="hover:bg-surface-elevated/60 transition-colors group">
                  <td className="p-4 pl-6 font-mono text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">#{entries.indexOf(item) + 1}</span>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleMove(entries.indexOf(item), 'up')}
                          disabled={entries.indexOf(item) === 0}
                          className="p-1 hover:text-primary disabled:opacity-20 cursor-target"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          onClick={() => handleMove(entries.indexOf(item), 'down')}
                          disabled={entries.indexOf(item) === entries.length - 1}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Section Header with Index */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">05</span>
          <span className="text-text-primary font-bold">CAREER & EDUCATION TIMELINE</span>
        </div>
        <Link 
          href="/admin/timeline/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-xl transition-colors font-mono text-xs font-bold cursor-target shadow-md shadow-primary/20"
        >
          <Plus size={15} />
          <span>ADD ENTRY</span>
        </Link>
      </header>

      <div className="space-y-10">
        {renderTable(experience, 'Work Experience', <Briefcase size={15} className="text-primary" />)}
        {renderTable(education, 'Academic Background', <GraduationCap size={15} className="text-secondary" />)}
      </div>
    </div>
  );
}
