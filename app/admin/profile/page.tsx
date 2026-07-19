'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { profileSchema } from '@/lib/validations/profile';
import FileUpload from '@/app/components/admin/FileUpload';
import { Loader2, Save } from 'lucide-react';

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const lanyardUrl = watch('lanyardImageUrl');
  const cvUrl = watch('cvFileUrl');

  useEffect(() => {
    fetch('/api/public/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          reset(data); // Populate form with existing data
        }
      })
      .finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to save profile');
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || 'Error saving profile');
    } finally {
      setIsSaving(false);
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
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Email</label>
            <input 
              {...register('email')} 
              type="email"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Phone</label>
            <input 
              {...register('phone')} 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Address</label>
            <input 
              {...register('address')} 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
          </div>
        </div>

        {/* Text Areas */}
        <div className="space-y-6 border-t border-white/10 pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Short Description (English)</label>
              <textarea 
                {...register('shortDescriptionEn')} 
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Short Description (Indonesia)</label>
              <textarea 
                {...register('shortDescriptionId')} 
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors resize-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Full Biography (English)</label>
              <textarea 
                {...register('fullBiographyEn')} 
                rows={5}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Full Biography (Indonesia)</label>
              <textarea 
                {...register('fullBiographyId')} 
                rows={5}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-6 border-t border-white/10 pt-6">
          <h3 className="text-lg font-medium text-white/90">Social Links</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">LinkedIn URL</label>
              <input {...register('linkedinUrl')} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" />
              {errors.linkedinUrl && <p className="text-red-500 text-xs">{errors.linkedinUrl.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">GitHub URL</label>
              <input {...register('githubUrl')} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" />
              {errors.githubUrl && <p className="text-red-500 text-xs">{errors.githubUrl.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Instagram URL</label>
              <input {...register('instagramUrl')} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" />
              {errors.instagramUrl && <p className="text-red-500 text-xs">{errors.instagramUrl.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Twitter URL</label>
              <input {...register('twitterUrl')} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" />
              {errors.twitterUrl && <p className="text-red-500 text-xs">{errors.twitterUrl.message}</p>}
            </div>
          </div>
        </div>

        {/* Uploads */}
        <div className="space-y-6 border-t border-white/10 pt-6">
          <h3 className="text-lg font-medium text-white/90">Media & Files</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 block mb-2">Avatar / Lanyard Image</label>
              <FileUpload 
                value={lanyardUrl || ''} 
                onChange={(url) => setValue('lanyardImageUrl', url)}
                label="Upload Avatar"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400 block mb-2">CV / Resume (PDF)</label>
              <FileUpload 
                value={cvUrl || ''} 
                onChange={(url) => setValue('cvFileUrl', url)}
                accept=".pdf"
                label="Upload CV"
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
