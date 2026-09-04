'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Loader2, ExternalLink, Github, RefreshCw } from 'lucide-react';
import type { Project, Skill } from '@prisma/client';

type ProjectWithTech = Project & { techStack: Skill[] };

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<ProjectWithTech[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncGithub = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/admin/projects/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Successfully synced ${data.reposSynced} repositories from GitHub!`);
        fetchProjects();
      } else {
        alert(`Sync finished with issues: ${data.details || JSON.stringify(data.errors || 'Unknown error')}`);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Failed to trigger GitHub sync.');
    } finally {
      setIsSyncing(false);
    }
  };

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

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === projects.length - 1)
    ) return;

    const newProjects = [...projects];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const currentOrder = newProjects[index].order;
    const swapOrder = newProjects[swapIndex].order;
    
    const actualCurrentOrder = currentOrder === swapOrder ? index : currentOrder;
    const actualSwapOrder = currentOrder === swapOrder ? swapIndex : swapOrder;

    newProjects[index].order = actualSwapOrder;
    newProjects[swapIndex].order = actualCurrentOrder;

    // Save to DB immediately
    try {
      await Promise.all([
        fetch(`/api/admin/projects/${newProjects[index].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...newProjects[index],
            techStackIds: newProjects[index].techStack.map(t => t.id)
          })
        }),
        fetch(`/api/admin/projects/${newProjects[swapIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...newProjects[swapIndex],
            techStackIds: newProjects[swapIndex].techStack.map(t => t.id)
          })
        })
      ]);
      fetchProjects();
    } catch (error) {
      console.error('Failed to update order:', error);
      fetchProjects();
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
          <span className="font-bold text-primary">02</span>
          <span className="text-text-primary font-bold">PROJECTS REPOSITORY MANAGEMENT</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSyncGithub}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-surface hover:bg-surface-elevated border border-border disabled:opacity-50 text-text-primary px-4 py-2 rounded-xl transition-colors font-mono text-xs cursor-target"
          >
            {isSyncing ? <Loader2 size={15} className="animate-spin text-primary" /> : <Github size={15} />}
            <span>{isSyncing ? 'SYNCING GITHUB...' : 'SYNC GITHUB'}</span>
          </button>
          
          <Link 
            href="/admin/projects/create"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background px-4 py-2 rounded-xl transition-colors font-mono text-xs font-bold cursor-target shadow-md shadow-primary/20"
          >
            <Plus size={15} />
            <span>ADD PROJECT</span>
          </Link>
        </div>
      </header>

      {/* Projects Table */}
      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-elevated border-b border-border text-text-muted font-mono text-xs uppercase tracking-wider">
                <th className="p-4 pl-6 w-24">Rank</th>
                <th className="p-4 w-32">Visual</th>
                <th className="p-4 min-w-[220px]">Title & Category</th>
                <th className="p-4">Tech Matrix</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans text-sm">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-text-muted font-mono text-xs">
                    No projects found in database. Create your first project or sync with GitHub.
                  </td>
                </tr>
              ) : (
                projects.map((item, index) => (
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
                          src={item.imageUrl} 
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
