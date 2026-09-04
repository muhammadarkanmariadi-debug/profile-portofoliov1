'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { projectSchema } from '@/lib/validations/project';
import FileUpload from '@/app/components/admin/FileUpload';
import { Loader2, Save, ArrowLeft, Check, Layers, ExternalLink, Github, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { Project, Skill } from '@prisma/client';

type ProjectFormValues = z.infer<typeof projectSchema>;
type ProjectWithTech = Project & { techStack: Skill[] };

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
      slug: initialData.slug || '',
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
      slug: '',
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
    <div className="space-y-8 max-w-4xl">
      {/* Header with Back button */}
      <div className="flex items-center gap-4 pb-6 border-b border-border">
        <Link
          href="/admin/projects"
          className="p-2.5 bg-surface hover:bg-surface-elevated border border-border rounded-xl text-text-muted hover:text-text-primary transition-colors cursor-target"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            PROJECT ENGINE // 02
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-text-primary tracking-tight">
            {initialData ? 'Edit Architecture & Project' : 'Register New Project'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Core Attributes Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold border-b border-border pb-4">
            <Sparkles size={15} className="text-primary" />
            <span>PRIMARY SPECIFICATIONS</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 font-sans text-sm">
            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Category / Domain *</label>
              <input
                {...register('categoryEn')}
                placeholder="e.g. Real-Time Distributed Systems"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
              />
              {errors.categoryEn && <p className="text-rose-500 font-mono text-xs">{errors.categoryEn.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Project Title *</label>
              <input
                {...register('titleEn')}
                placeholder="e.g. GigTix - High-Concurrency Ticketing Platform"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
              />
              {errors.titleEn && <p className="text-rose-500 font-mono text-xs">{errors.titleEn.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Custom URL Slug (Optional)</label>
              <input
                {...register('slug')}
                placeholder="e.g. gigtix-platform"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary font-mono text-xs focus:border-primary outline-none transition-colors"
              />
              {errors.slug && <p className="text-rose-500 font-mono text-xs">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Role / Scope of Work</label>
              <input
                {...register('roleEn')}
                placeholder="e.g. Lead Full-Stack Architect"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2 pt-2">
              <label className="inline-flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-surface-elevated border border-border">
                <input
                  type="checkbox"
                  {...register('isDeploy')}
                  className="w-4 h-4 accent-primary rounded bg-surface border-border"
                />
                <span className="font-mono text-xs uppercase tracking-wider text-text-primary font-bold">
                  Deployed Live in Production
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Narrative & Description */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <label className="font-mono text-xs text-text-muted uppercase tracking-wider block font-bold">
            Architecture Breakdown & System Overview
          </label>
          <textarea
            {...register('descriptionEn')}
            rows={5}
            className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors resize-none font-sans text-sm leading-relaxed"
            placeholder="Describe the technical architecture, problem statement, key bottlenecks resolved, and results..."
          />
        </div>

        {/* Endpoints & Links */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold border-b border-border pb-4">
            <ExternalLink size={15} className="text-secondary" />
            <span>EXTERNAL ACCESS ENDPOINTS</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 font-sans text-sm">
            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Live Production URL</label>
              <input
                {...register('liveUrl')}
                placeholder="https://app.domain.com"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors font-mono text-xs"
              />
              {errors.liveUrl && <p className="text-rose-500 font-mono text-xs">{errors.liveUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Source Repository (GitHub)</label>
              <input
                {...register('sourceCodeUrl')}
                placeholder="https://github.com/username/repo"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors font-mono text-xs"
              />
              {errors.sourceCodeUrl && <p className="text-rose-500 font-mono text-xs">{errors.sourceCodeUrl.message}</p>}
            </div>
          </div>
        </div>

        {/* Visual Asset Thumbnail */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <label className="font-mono text-xs text-text-muted uppercase tracking-wider block font-bold">
            Project Visual Asset / Screenshot
          </label>
          <FileUpload
            value={imageUrl || ''}
            onChange={(url) => setValue('imageUrl', url)}
            label="Upload Screenshot"
            folder="portfolio/projects"
          />
        </div>

        {/* Tech Stack Matrix Selection */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold border-b border-border pb-4">
            <Layers size={15} className="text-emerald-400" />
            <span>ASSIGNED TECHNOLOGY STACK ({techStackIds.length} SELECTED)</span>
          </div>

          {Object.keys(groupedSkills).length === 0 ? (
            <div className="font-mono text-xs text-text-muted bg-surface-elevated p-6 rounded-2xl text-center">
              No skills found in registry. Add skills from the Skills section first.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedSkills).sort().map(category => (
                <div key={category} className="space-y-2.5">
                  <h4 className="font-mono text-[11px] font-bold text-primary tracking-wider uppercase">
                    {CATEGORY_DISPLAY_MAP[category] || category.replace(/_/g, ' ')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {groupedSkills[category].sort((a, b) => a.order - b.order).map(skill => {
                      const isSelected = techStackIds.includes(skill.id);
                      return (
                        <button
                          type="button"
                          key={skill.id}
                          onClick={() => toggleSkill(skill.id)}
                          className={`
                            flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase transition-all cursor-target font-bold
                            ${isSelected
                              ? 'bg-primary text-background shadow-sm shadow-primary/20'
                              : 'bg-surface-elevated border border-border text-text-muted hover:text-text-primary hover:border-primary/40'
                            }
                          `}
                        >
                          {isSelected && <Check size={13} />}
                          <span>{skill.title}</span>
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
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl font-mono text-xs">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-background rounded-2xl transition-all font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-target shadow-lg shadow-primary/20"
          >
            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>SAVE PROJECT SPECIFICATION</span>
          </button>
        </div>
      </form>
    </div>
  );
}
