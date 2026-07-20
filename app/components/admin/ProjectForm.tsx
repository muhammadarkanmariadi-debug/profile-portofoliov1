'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { projectSchema } from '@/lib/validations/project';
import FileUpload from '@/app/components/admin/FileUpload';
import { Loader2, Save, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import type { Project, Skill } from '@prisma/client';

type ProjectFormValues = z.infer<typeof projectSchema>;
type ProjectWithTech = Project & { techStack: Skill[] };

export default function ProjectForm({ initialData }: { initialData?: ProjectWithTech }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetch('/api/public/skills')
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error('Failed to load skills:', err));
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: initialData ? {
      categoryEn: initialData.categoryEn,
      categoryId: initialData.categoryId,
      titleEn: initialData.titleEn,
      titleId: initialData.titleId,
      descriptionEn: initialData.descriptionEn,
      descriptionId: initialData.descriptionId,
      roleEn: initialData.roleEn,
      roleId: initialData.roleId,
      isDeploy: initialData.isDeploy,
      liveUrl: initialData.liveUrl,
      sourceCodeUrl: initialData.sourceCodeUrl,
      imageUrl: initialData.imageUrl,
      order: initialData.order,
      techStackIds: initialData.techStack.map(t => t.id),
    } : {
      order: 0,
      isDeploy: false,
      techStackIds: [],
    }
  });

  const imageUrl = watch('imageUrl');
  const techStackIds = watch('techStackIds');
  const isDeploy = watch('isDeploy');

  const toggleSkill = (skillId: string) => {
    const current = new Set(techStackIds);
    if (current.has(skillId)) {
      current.delete(skillId);
    } else {
      current.add(skillId);
    }
    setValue('techStackIds', Array.from(current));
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSaving(true);
    setError('');
    
    try {
      const url = initialData 
        ? `/api/admin/projects/${initialData.id}` 
        : '/api/admin/projects';
        
      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        const errorMsg = typeof result.error === 'object' ? JSON.stringify(result.error) : (result.error || 'Failed to save project');
        throw new Error(errorMsg);
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message);
      setIsSaving(false);
    }
  };

  // Group skills for UI
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/projects"
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">
          {initialData ? 'Edit Project' : 'Create Project'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-4xl">
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Category (EN) *</label>
            <input 
              {...register('categoryEn')} 
              placeholder="e.g. Web App, Mobile App, UI/UX"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.categoryEn && <p className="text-red-500 text-xs">{errors.categoryEn.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Category (ID) *</label>
            <input 
              {...register('categoryId')} 
              placeholder="e.g. Aplikasi Web, Aplikasi Mobile"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Title / Name (EN) *</label>
            <input 
              {...register('titleEn')} 
              placeholder="e.g. GigTix - Ticketing App"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.titleEn && <p className="text-red-500 text-xs">{errors.titleEn.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Title / Name (ID) *</label>
            <input 
              {...register('titleId')} 
              placeholder="e.g. GigTix - Aplikasi Tiket"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.titleId && <p className="text-red-500 text-xs">{errors.titleId.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Your Role (EN)</label>
            <input 
              {...register('roleEn')} 
              placeholder="e.g. Fullstack Developer"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Your Role (ID)</label>
            <input 
              {...register('roleId')} 
              placeholder="e.g. Pengembang Fullstack"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
          </div>
          
          <div className="space-y-2 pt-8 md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                {...register('isDeploy')}
                className="w-5 h-5 accent-primary rounded bg-black/50 border-white/10"
              />
              <span className="text-white">Project is deployed (Live)</span>
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description (EN)</label>
            <textarea 
              {...register('descriptionEn')} 
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors resize-none"
              placeholder="Describe the project, its goals, and what you built..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description (ID)</label>
            <textarea 
              {...register('descriptionId')} 
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors resize-none"
              placeholder="Jelaskan proyek ini, tujuannya, dan apa yang kamu bangun..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Live URL {isDeploy && '*'}</label>
            <input 
              {...register('liveUrl')} 
              placeholder="https://..."
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.liveUrl && <p className="text-red-500 text-xs">{errors.liveUrl.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Source Code (GitHub) URL</label>
            <input 
              {...register('sourceCodeUrl')} 
              placeholder="https://github.com/..."
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.sourceCodeUrl && <p className="text-red-500 text-xs">{errors.sourceCodeUrl.message}</p>}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <label className="text-sm text-gray-400 block mb-4">Project Image Thumbnail</label>
          <FileUpload 
            value={imageUrl || ''} 
            onChange={(url) => setValue('imageUrl', url)}
            label="Upload Thumbnail"
            folder="portfolio/projects"
          />
        </div>

        {/* Tech Stack Selection */}
        <div className="border-t border-white/10 pt-6">
          <label className="text-sm text-gray-400 block mb-4">Select Tech Stack</label>
          
          {Object.keys(groupedSkills).length === 0 ? (
            <div className="text-sm text-gray-500 italic bg-white/5 p-4 rounded-lg">
              No skills found. Please add skills first before assigning them to projects.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedSkills).sort().map(category => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                    {category.replace(/_/g, ' ')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {groupedSkills[category].sort((a,b) => a.order - b.order).map(skill => {
                      const isSelected = techStackIds.includes(skill.id);
                      return (
                        <button
                          type="button"
                          key={skill.id}
                          onClick={() => toggleSkill(skill.id)}
                          className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                            ${isSelected 
                              ? 'bg-primary/20 border-primary text-primary' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                            }
                          `}
                        >
                          {isSelected && <Check size={14} />}
                          {skill.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="pt-4 flex justify-end border-t border-white/10">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
}
