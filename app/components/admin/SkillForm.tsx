'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { skillSchema } from '@/lib/validations/skill';
import FileUpload from '@/app/components/admin/FileUpload';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
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
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/skills"
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">
          {initialData ? 'Edit Skill' : 'Add Skill'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Category *</label>
          <select 
            {...register('category')}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Title / Name *</label>
          <input 
            {...register('title')} 
            placeholder="e.g. React, Node.js, Figma"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <label className="text-sm text-gray-400 block mb-2">Logo (Optional)</label>
          <FileUpload 
            value={logoUrl || ''} 
            onChange={(url) => setValue('logoUrl', url)}
            label="Upload Logo"
            folder="portfolio/skills"
          />
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
            Save Skill
          </button>
        </div>
      </form>
    </div>
  );
}
