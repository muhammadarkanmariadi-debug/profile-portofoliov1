'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Loader2, ExternalLink, Github } from 'lucide-react';
import type { Project, Skill } from '@prisma/client';

type ProjectWithTech = Project & { techStack: Skill[] };

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<ProjectWithTech[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/public/projects');
      const data = await res.json();
      setProjects(data);
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Projects Management</h1>
        <Link 
          href="/admin/projects/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={20} />
          Add Project
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/10 text-gray-400 text-sm">
              <th className="p-4 font-medium w-24">Order</th>
              <th className="p-4 font-medium w-32">Image</th>
              <th className="p-4 font-medium min-w-[200px]">Details</th>
              <th className="p-4 font-medium">Tech Stack</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((item, index) => (
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
                        disabled={index === projects.length - 1}
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
                    <div className="text-sm text-primary/80 mb-2">{item.categoryEn}</div>
                    <div className="flex gap-2">
                      {item.liveUrl && (
                        <a href={item.liveUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-gray-400 hover:text-white bg-white/5 px-2 py-1 rounded">
                          <ExternalLink size={12} /> Live
                        </a>
                      )}
                      {item.sourceCodeUrl && (
                        <a href={item.sourceCodeUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-gray-400 hover:text-white bg-white/5 px-2 py-1 rounded">
                          <Github size={12} /> Code
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {item.techStack.slice(0, 5).map(tech => (
                        <span key={tech.id} className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          {tech.title}
                        </span>
                      ))}
                      {item.techStack.length > 5 && (
                        <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                          +{item.techStack.length - 5}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/projects/edit/${item.id}`}
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
