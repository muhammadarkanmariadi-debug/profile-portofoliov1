'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { achievementSchema } from '@/lib/validations/achievement';
import FileUpload from '@/app/components/admin/FileUpload';
import { Loader2, Save, ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';
import type { Achievement } from '@prisma/client';

type AchievementFormValues = z.infer<typeof achievementSchema>;

export default function AchievementForm({ initialData }: { initialData?: Achievement }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const formatDateForInput = (dateString?: Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema) as any,
    defaultValues: initialData ? {
      slug: initialData.slug || '',
      titleEn: initialData.titleEn,
      titleId: initialData.titleId,
      statusEn: initialData.statusEn,
      statusId: initialData.statusId,
      descriptionEn: initialData.descriptionEn,
      descriptionId: initialData.descriptionId,
      date: initialData.date,
      imageUrl: initialData.imageUrl,
      order: initialData.order,
    } : {
      slug: '',
      order: 0,
      date: new Date(),
    }
  });

  const imageUrl = watch('imageUrl');

  const onSubmit = async (data: AchievementFormValues) => {
    setIsSaving(true);
    setError('');
    
    try {
      const url = initialData 
        ? `/api/admin/achievements/${initialData.id}` 
        : '/api/admin/achievements';
        
      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to save achievement');
      }

      router.push('/admin/achievements');
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
          href="/admin/achievements"
          className="p-2.5 bg-surface hover:bg-surface-elevated border border-border rounded-xl text-text-muted hover:text-text-primary transition-colors cursor-target"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            CREDENTIALS ENGINE // 04
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-text-primary tracking-tight">
            {initialData ? 'Edit Credential & Honor' : 'Register New Credential'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold border-b border-border pb-4">
            <Trophy size={15} className="text-amber-400" />
            <span>HONOR DETAILS & RECOGNITION</span>
          </div>

          <div className="space-y-6 font-sans text-sm">
            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Award / Honor Title *</label>
              <input 
                {...register('titleEn')} 
                placeholder="e.g. 1st Place National Software Engineering Hackathon"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
              />
              {errors.titleEn && <p className="text-rose-500 font-mono text-xs">{errors.titleEn.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Custom URL Slug (Optional)</label>
              <input 
                {...register('slug')} 
                placeholder="e.g. 1st-place-national-hackathon"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary font-mono text-xs focus:border-primary outline-none transition-colors"
              />
              {errors.slug && <p className="text-rose-500 font-mono text-xs">{errors.slug.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Recognition Standing / Status *</label>
                <input 
                  {...register('statusEn')} 
                  placeholder="e.g. 1st Place Winner, Certified Developer"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
                />
                {errors.statusEn && <p className="text-rose-500 font-mono text-xs">{errors.statusEn.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Issue / Conferment Date *</label>
                <input 
                  type="date"
                  {...register('date')} 
                  defaultValue={formatDateForInput(initialData?.date)}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors font-mono text-xs"
                />
                {errors.date && <p className="text-rose-500 font-mono text-xs">{errors.date.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Description & Scope</label>
              <textarea 
                {...register('descriptionEn')} 
                rows={4}
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors resize-none leading-relaxed"
                placeholder="Details about the competition scope, project presented, and organizing body..."
              />
            </div>
          </div>
        </div>

        {/* Certificate / Document Upload */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <label className="font-mono text-xs text-text-muted uppercase tracking-wider block font-bold">
            Certificate Document / Trophy Image (Optional)
          </label>
          <FileUpload 
            value={imageUrl || ''} 
            onChange={(url) => setValue('imageUrl', url)}
            label="Upload Document Photo"
            folder="portfolio/achievements"
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
            <span>SAVE CREDENTIAL</span>
          </button>
        </div>
      </form>
    </div>
  );
}
