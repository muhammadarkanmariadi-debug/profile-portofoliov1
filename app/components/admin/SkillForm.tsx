'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { skillSchema } from '@/lib/validations/skill';
import FileUpload from '@/app/components/admin/FileUpload';
import { Loader2, Save, ArrowLeft, Code2 } from 'lucide-react';
import Link from 'next/link';
import type { Skill } from '@prisma/client';

type SkillFormValues = z.infer<typeof skillSchema>;

const CATEGORIES = [
  'FRONTEND',
  'BACKEND',
  'DATABASE_ORM',
  'BAHASA_LAINNYA',
  'VERSION_CONTROL',
  'CLOUD_DEPLOYMENT',
  'DESIGN_PROTOTYPING',
  'SISTEM_OPERASI',
];

const CATEGORY_LABELS: Record<string, string> = {
  FRONTEND: 'Frontend & UI Frameworks',
  BACKEND: 'Backend & Server Systems',
  DATABASE_ORM: 'Database & ORM Technologies',
  BAHASA_LAINNYA: 'Other Programming Languages',
  VERSION_CONTROL: 'Version Control & Workflow',
  CLOUD_DEPLOYMENT: 'Cloud & Deployment Infrastructure',
  DESIGN_PROTOTYPING: 'Design & Prototyping Tools',
  SISTEM_OPERASI: 'Operating Systems & Environments',
};

export default function SkillForm({ initialData }: { initialData?: Skill }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema) as any,
    defaultValues: initialData ? {
      category: initialData.category as any,
      title: initialData.title,
      logoUrl: initialData.logoUrl,
      order: initialData.order,
    } : {
      category: 'FRONTEND',
      order: 0,
    }
  });

  const logoUrl = watch('logoUrl');

  const onSubmit = async (data: SkillFormValues) => {
    setIsSaving(true);
    setError('');
    
    try {
      const url = initialData 
        ? `/api/admin/skills/${initialData.id}` 
        : '/api/admin/skills';
        
      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to save skill');
      }

      router.push('/admin/skills');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4 pb-6 border-b border-border">
        <Link 
          href="/admin/skills"
          className="p-2.5 bg-surface hover:bg-surface-elevated border border-border rounded-xl text-text-muted hover:text-text-primary transition-colors cursor-target"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            SKILLS MATRIX // 03
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-text-primary tracking-tight">
            {initialData ? 'Edit Technology Skill' : 'Register New Technology'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold border-b border-border pb-4">
            <Code2 size={15} className="text-primary" />
            <span>TECHNOLOGY SPECIFICATIONS</span>
          </div>

          <div className="space-y-6 font-sans text-sm">
            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Domain Category *</label>
              <select 
                {...register('category')}
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors font-mono text-xs"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat.replace(/_/g, ' ')}</option>
                ))}
              </select>
              {errors.category && <p className="text-rose-500 font-mono text-xs">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Title / Name *</label>
              <input 
                {...register('title')} 
                placeholder="e.g. Next.js, TypeScript, PostgreSQL, Docker"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
              />
              {errors.title && <p className="text-rose-500 font-mono text-xs">{errors.title.message}</p>}
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <label className="font-mono text-xs text-text-muted uppercase tracking-wider block font-bold">
            Skill Logo / Icon (SVG / PNG)
          </label>
          <FileUpload 
            value={logoUrl || ''} 
            onChange={(url) => setValue('logoUrl', url)}
            label="Upload Tech Icon"
            folder="portfolio/skills"
          />
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl font-mono text-xs">
            {error}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-background rounded-2xl transition-all font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-target shadow-lg shadow-primary/20"
          >
            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>SAVE SKILL</span>
          </button>
        </div>
      </form>
    </div>
  );
}
