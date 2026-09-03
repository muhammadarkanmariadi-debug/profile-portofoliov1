'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { achievementSchema } from '@/lib/validations/achievement';
import FileUpload from '@/app/components/admin/FileUpload';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Achievement } from '@prisma/client';

type AchievementFormValues = z.infer<typeof achievementSchema>;

export default function AchievementForm({ initialData }: { initialData?: Achievement }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Format date for the date input (YYYY-MM-DD)
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
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/achievements"
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">
          {initialData ? 'Edit Achievement' : 'Add Achievement'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl">
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Title / Award Name (EN) *</label>
            <input 
              {...register('titleEn')} 
              placeholder="e.g. 1st Place National Hackathon"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.titleEn && <p className="text-red-500 text-xs">{errors.titleEn.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Title / Award Name (ID) *</label>
            <input 
              {...register('titleId')} 
              placeholder="e.g. Juara 1 Hackathon Nasional"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.titleId && <p className="text-red-500 text-xs">{errors.titleId.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-gray-400">Custom URL Slug (optional, auto-generated from Title EN if blank)</label>
            <input 
              {...register('slug')} 
              placeholder="e.g. 1st-place-national-hackathon"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-primary outline-none transition-colors"
            />
            {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Status / Role (EN) *</label>
            <input 
              {...register('statusEn')} 
              placeholder="e.g. Winner, Participant, Speaker"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.statusEn && <p className="text-red-500 text-xs">{errors.statusEn.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Status / Role (ID) *</label>
            <input 
              {...register('statusId')} 
              placeholder="e.g. Pemenang, Peserta, Pembicara"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.statusId && <p className="text-red-500 text-xs">{errors.statusId.message}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Date *</label>
            <input 
              type="date"
              {...register('date')} 
              defaultValue={formatDateForInput(initialData?.date)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors [color-scheme:dark]"
            />
            {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description (EN)</label>
            <textarea 
              {...register('descriptionEn')} 
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors resize-none"
              placeholder="Details about the achievement..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description (ID)</label>
            <textarea 
              {...register('descriptionId')} 
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors resize-none"
              placeholder="Detail tentang pencapaian..."
            />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <label className="text-sm text-gray-400 block mb-2">Image / Certificate (Optional)</label>
          <FileUpload 
            value={imageUrl || ''} 
            onChange={(url) => setValue('imageUrl', url)}
            label="Upload Image"
            folder="portfolio/achievements"
          />
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
            Save Achievement
          </button>
        </div>
      </form>
    </div>
  );
}
