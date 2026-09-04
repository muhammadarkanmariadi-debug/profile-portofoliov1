'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { timelineSchema } from '@/lib/validations/timeline';
import { Loader2, Save, ArrowLeft, History } from 'lucide-react';
import Link from 'next/link';
import type { TimelineEntry } from '@prisma/client';

type TimelineFormValues = z.infer<typeof timelineSchema>;

export default function TimelineForm({ initialData }: { initialData?: TimelineEntry }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineSchema) as any,
    defaultValues: initialData ? {
      type: initialData.type,
      category: initialData.category,
      title: initialData.title,
      description: initialData.description || '',
      order: initialData.order,
    } : {
      type: 'EXPERIENCE',
      category: '',
      title: '',
      description: '',
      order: 0,
    }
  });

  const onSubmit = async (data: TimelineFormValues) => {
    setIsSaving(true);
    setError('');
    
    try {
      const url = initialData 
        ? `/api/admin/timeline/${initialData.id}` 
        : '/api/admin/timeline';
        
      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to save timeline entry');
      }

      router.push('/admin/timeline');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4 pb-6 border-b border-border">
        <Link 
          href="/admin/timeline"
          className="p-2.5 bg-surface hover:bg-surface-elevated border border-border rounded-xl text-text-muted hover:text-text-primary transition-colors cursor-target"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            TIMELINE ENGINE // 05
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-text-primary tracking-tight">
            {initialData ? 'Edit Career Milestone' : 'Register New Milestone'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold border-b border-border pb-4">
            <History size={15} className="text-primary" />
            <span>MILESTONE CLASSIFICATION</span>
          </div>

          <div className="space-y-6 font-sans text-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Milestone Type *</label>
                <select 
                  {...register('type')}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors font-mono text-xs"
                >
                  <option value="EXPERIENCE">Work & Professional Experience</option>
                  <option value="EDUCATION">Formal Education & Academics</option>
                </select>
                {errors.type && <p className="text-rose-500 font-mono text-xs">{errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Institution / Period / Category *</label>
                <input 
                  {...register('category')} 
                  placeholder="e.g. 2024 - Present / SMK Telkom Malang"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
                />
                {errors.category && <p className="text-rose-500 font-mono text-xs">{errors.category.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Role / Degree Title *</label>
              <input 
                {...register('title')} 
                placeholder="e.g. Software Engineering Lead, Full-Stack Intern"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
              />
              {errors.title && <p className="text-rose-500 font-mono text-xs">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Description & Responsibilities</label>
              <textarea 
                {...register('description')} 
                rows={4}
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors resize-none leading-relaxed"
                placeholder="Key responsibilities, architectural focus, achievements..."
              />
            </div>
          </div>
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
            <span>SAVE MILESTONE</span>
          </button>
        </div>
      </form>
    </div>
  );
}
