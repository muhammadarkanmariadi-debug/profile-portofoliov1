'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { timelineSchema } from '@/lib/validations/timeline';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
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
      categoryEn: initialData.categoryEn,
      categoryId: initialData.categoryId,
      titleEn: initialData.titleEn,
      titleId: initialData.titleId,
      descriptionEn: initialData.descriptionEn,
      descriptionId: initialData.descriptionId,
      order: initialData.order,
    } : {
      type: 'EXPERIENCE',
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
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/timeline"
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">
          {initialData ? 'Edit Timeline Entry' : 'Create Timeline Entry'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Type *</label>
            <select 
              {...register('type')}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            >
              <option value="EXPERIENCE">Experience</option>
              <option value="EDUCATION">Education</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Category / Institution (EN) *</label>
            <input 
              {...register('categoryEn')} 
              placeholder="e.g. University of Example or Tech Corp"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.categoryEn && <p className="text-red-500 text-xs">{errors.categoryEn.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Category / Institution (ID) *</label>
            <input 
              {...register('categoryId')} 
              placeholder="e.g. Universitas Contoh atau Perusahaan Teknologi"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Title / Degree (EN) *</label>
            <input 
              {...register('titleEn')} 
              placeholder="e.g. Bachelor of Science or Senior Developer"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.titleEn && <p className="text-red-500 text-xs">{errors.titleEn.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Title / Degree (ID) *</label>
            <input 
              {...register('titleId')} 
              placeholder="e.g. Sarjana Sains atau Senior Developer"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.titleId && <p className="text-red-500 text-xs">{errors.titleId.message}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description / Details (EN)</label>
            <textarea 
              {...register('descriptionEn')} 
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors resize-none"
              placeholder="Brief description of responsibilities or achievements..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description / Details (ID)</label>
            <textarea 
              {...register('descriptionId')} 
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors resize-none"
              placeholder="Deskripsi singkat tanggung jawab atau pencapaian..."
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
}
