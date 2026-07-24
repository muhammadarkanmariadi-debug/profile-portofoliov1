'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
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
    
    // Swap order values visually
    const currentOrder = newEntries[index].order;
    const swapOrder = newEntries[swapIndex].order;
    
    // Fallback if order is same
    const actualCurrentOrder = currentOrder === swapOrder ? index : currentOrder;
    const actualSwapOrder = currentOrder === swapOrder ? swapIndex : swapOrder;

    newEntries[index].order = actualSwapOrder;
    newEntries[swapIndex].order = actualCurrentOrder;

    // Sort visually immediately
    newEntries.sort((a, b) => a.order - b.order);
    setEntries(newEntries);

    // Save to DB
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
      fetchEntries(); // Revert on failure
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

  const renderTable = (data: TimelineEntry[], title: string) => (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4 text-white/90">{title}</h2>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm">
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category / Institution</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No {title.toLowerCase()} found.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 w-24">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleMove(entries.indexOf(item), 'up')}
                        disabled={entries.indexOf(item) === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => handleMove(entries.indexOf(item), 'down')}
                        disabled={entries.indexOf(item) === entries.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-white">{item.titleEn}</td>
                  <td className="p-4 text-gray-400">{item.categoryEn}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/timeline/edit/${item.id}`}
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Timeline Management</h1>
        <Link 
          href="/admin/timeline/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={20} />
          Add Entry
        </Link>
      </div>

      {renderTable(experience, 'Experience')}
      {renderTable(education, 'Education')}
    </div>
  );
}
