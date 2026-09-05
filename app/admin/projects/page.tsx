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
  ExternalLink, 
  Github, 
  GripVertical,
  LayoutGrid,
  List,
  CheckCircle2
} from 'lucide-react';
import type { Project, Skill } from '@prisma/client';
import { getOptimizedImageUrl } from '@/lib/utils/image';

type ProjectWithTech = Project & { techStack: Skill[] };

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<ProjectWithTech[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/public/projects');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error('API Error:', data);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  // Persist reordered array to database
  const saveReorderedProjects = async (reorderedList: ProjectWithTech[]) => {
    setIsSavingOrder(true);
    try {
      const itemsToUpdate = reorderedList.map((p, idx) => ({
        id: p.id,
        order: idx + 1,
      }));

      const res = await fetch('/api/admin/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      });

      if (!res.ok) throw new Error('Failed to save order');
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Error saving reordered projects:', err);
      alert('Failed to save new project order to database.');
      fetchProjects();
    } finally {
      setIsSavingOrder(false);
    }
  };

  // HTML5 Drag and Drop Handlers
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

    const updated = [...projects];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    // Update order values sequentially
    const normalized = updated.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setProjects(normalized);
    setDraggedIndex(null);
    setDragOverIndex(null);

    await saveReorderedProjects(normalized);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Up / Down Button Fallback
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === projects.length - 1)
    ) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const normalized = updated.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setProjects(normalized);
    await saveReorderedProjects(normalized);
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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">02</span>
          <span className="text-text-primary font-bold">PROJECTS REPOSITORY & SORTING</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Order Saving Status Indicator */}
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

          {/* View Mode Toggle */}
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
              title="Table List View"
            >
              <List size={15} />
            </button>
          </div>

          <Link 
            href="/admin/projects/create"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-xl transition-colors font-mono text-xs font-bold cursor-target shadow-md shadow-primary/20"
          >
            <Plus size={15} />
            <span>ADD PROJECT</span>
          </Link>
        </div>
      </header>

      {/* Helper Tip Bar */}
      <div className="w-full bg-surface-elevated/70 border border-border/80 rounded-2xl px-5 py-3 flex items-center justify-between font-mono text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-primary" />
          <span>Tip: Drag and drop any project card/row to easily reorder projects for the portfolio landing & work archive.</span>
        </div>
        <span className="font-bold text-text-primary">{projects.length} Projects</span>
      </div>

      {projects.length === 0 ? (
        <div className="bg-surface border border-border rounded-3xl p-12 text-center text-text-muted font-mono text-xs">
          No projects found in database. Click &apos;ADD PROJECT&apos; above to create your first project.
        </div>
      ) : viewMode === 'cards' ? (
        /* ------------------------------------------------------------------ */
        /* 1. Interactive Drag-and-Drop Card Grid View                        */
        /* ------------------------------------------------------------------ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((item, index) => {
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
                {/* Card Top: Drag Grip + Rank Badge + Controls */}
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
                        disabled={index === projects.length - 1}
                        className="p-1 text-text-muted hover:text-primary disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-surface-elevated border border-border mb-4">
                    {item.imageUrl ? (
                      <img
                        src={getOptimizedImageUrl(item.imageUrl)}
                        alt={item.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-text-muted">
                        NO PREVIEW IMAGE
                      </div>
                    )}
                    <span className="absolute top-2.5 right-2.5 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-md border border-white/10 text-text-primary">
                      {item.category}
                    </span>
                  </div>

                  {/* Project Info */}
                  <h3 className="font-heading font-extrabold text-lg text-text-primary truncate mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-muted text-xs font-sans line-clamp-2 leading-relaxed mb-4">
                    {item.description || 'No description provided.'}
                  </p>
                </div>

                {/* Card Footer: Tech Stack + Edit / Delete Actions */}
                <div className="pt-4 border-t border-border/80 mt-2">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.techStack.slice(0, 3).map((tech) => (
                      <span key={tech.id} className="font-mono text-[10px] uppercase tracking-wider bg-surface-elevated border border-border text-text-primary px-2 py-0.5 rounded-full">
                        {tech.title}
                      </span>
                    ))}
                    {item.techStack.length > 3 && (
                      <span className="font-mono text-[10px] bg-surface-elevated border border-border text-text-muted px-2 py-0.5 rounded-full">
                        +{item.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] flex items-center gap-1 text-text-muted hover:text-text-primary bg-surface-elevated border border-border px-2 py-1 rounded-lg cursor-target"
                          title="Open Live Preview"
                        >
                          <ExternalLink size={12} />
                          <span>Live</span>
                        </a>
                      )}
                      {item.sourceCodeUrl && (
                        <a
                          href={item.sourceCodeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] flex items-center gap-1 text-text-muted hover:text-text-primary bg-surface-elevated border border-border px-2 py-1 rounded-lg cursor-target"
                          title="Open GitHub Repository"
                        >
                          <Github size={12} />
                          <span>Repo</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/projects/edit/${item.id}`}
                        className="p-2 bg-surface-elevated hover:bg-primary hover:text-background border border-border text-text-muted rounded-xl transition-all cursor-target"
                        title="Edit project"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-surface-elevated hover:bg-rose-500/20 hover:text-rose-400 border border-border text-text-muted rounded-xl transition-all cursor-target"
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ------------------------------------------------------------------ */
        /* 2. Interactive Drag-and-Drop Table List View                       */
        /* ------------------------------------------------------------------ */
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-elevated border-b border-border text-text-muted font-mono text-xs uppercase tracking-wider">
                  <th className="p-4 pl-6 w-28">Drag / Rank</th>
                  <th className="p-4 w-32">Visual</th>
                  <th className="p-4 min-w-[220px]">Title & Category</th>
                  <th className="p-4">Tech Matrix</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans text-sm">
                {projects.map((item, index) => {
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
                          <div className="text-text-muted group-hover:text-primary transition-colors cursor-grab">
                            <GripVertical size={16} />
                          </div>
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
                              disabled={index === projects.length - 1}
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
                            NO IMG
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-text-primary mb-1">{item.title}</div>
                        <div className="font-mono text-xs text-primary mb-2">{item.category}</div>
                        <div className="flex items-center gap-2">
                          {item.liveUrl && (
                            <a 
                              href={item.liveUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="font-mono text-[11px] flex items-center gap-1 text-text-muted hover:text-text-primary bg-surface-elevated border border-border px-2 py-0.5 rounded-md cursor-target"
                            >
                              <ExternalLink size={11} />
                              <span>Live</span>
                            </a>
                          )}
                          {item.sourceCodeUrl && (
                            <a 
                              href={item.sourceCodeUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="font-mono text-[11px] flex items-center gap-1 text-text-muted hover:text-text-primary bg-surface-elevated border border-border px-2 py-0.5 rounded-md cursor-target"
                            >
                              <Github size={11} />
                              <span>Repo</span>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                          {item.techStack.slice(0, 4).map(tech => (
                            <span key={tech.id} className="font-mono text-[10px] uppercase tracking-wider bg-surface-elevated border border-border text-text-primary px-2 py-0.5 rounded-full">
                              {tech.title}
                            </span>
                          ))}
                          {item.techStack.length > 4 && (
                            <span className="font-mono text-[10px] bg-surface-elevated border border-border text-text-muted px-2 py-0.5 rounded-full">
                              +{item.techStack.length - 4}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex justify-end gap-2">
                          <Link 
                            href={`/admin/projects/edit/${item.id}`}
                            className="p-2 bg-surface-elevated hover:bg-primary hover:text-background border border-border text-text-muted rounded-xl transition-all cursor-target"
                            title="Edit project"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-surface-elevated hover:bg-rose-500/20 hover:text-rose-400 border border-border text-text-muted rounded-xl transition-all cursor-target"
                            title="Delete project"
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
