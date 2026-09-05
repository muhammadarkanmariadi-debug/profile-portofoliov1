'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { profileSchema } from '@/lib/validations/profile';
import FileUpload from '@/app/components/admin/FileUpload';
import { Loader2, Save, CheckCircle2, User, FileText, Share2, Image as ImageIcon } from 'lucide-react';

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

  const cvUrl = watch('cvFileUrl');

  useEffect(() => {
    fetch('/api/public/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          reset(data);
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

      if (!res.ok) throw new Error('Failed to save profile configuration');
      setMessage('Profile settings updated successfully!');
      setTimeout(() => setMessage(''), 3500);
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
    <div className="space-y-8">
      {/* Section Header with Index */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">01</span>
          <span className="text-text-primary font-bold">PROFILE & BIOGRAPHY CONFIGURATION</span>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Contact Info Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold border-b border-border pb-4">
            <User size={15} className="text-primary" />
            <span>CONTACT & IDENTITY METADATA</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 font-sans text-sm">
            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Primary Email *</label>
              <input 
                {...register('email')} 
                type="email"
                placeholder="developer@example.com"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
              />
              {errors.email && <p className="text-rose-500 font-mono text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Direct Phone</label>
              <input 
                {...register('phone')} 
                placeholder="+62 8xx xxxx xxxx"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Physical Base / City</label>
              <input 
                {...register('address')} 
                placeholder="Malang, East Java, Indonesia"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Biography & Philosophy Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold border-b border-border pb-4">
            <FileText size={15} className="text-secondary" />
            <span>EDITORIAL BIOGRAPHY & NARRATIVE</span>
          </div>

          <div className="space-y-6 font-sans text-sm">
            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Short Bio / Hook (Hero Statement)</label>
              <textarea 
                {...register('shortDescription')} 
                rows={3}
                placeholder="e.g. Full-Stack Developer & Software Engineering Student at SMK Telkom Malang specializing in Next.js, Nest.js, Laravel, and cloud architectures."
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Full Biography & Engineering Philosophy</label>
              <textarea 
                {...register('fullBiography')} 
                rows={6}
                placeholder="Detailed engineering background, focus areas, and architectural principles..."
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Social Presence Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold border-b border-border pb-4">
            <Share2 size={15} className="text-emerald-400" />
            <span>EXTERNAL LINKS & NETWORKS</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 font-sans text-sm">
            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">LinkedIn URL</label>
              <input 
                {...register('linkedinUrl')} 
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none" 
              />
              {errors.linkedinUrl && <p className="text-rose-500 font-mono text-xs">{errors.linkedinUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">GitHub URL</label>
              <input 
                {...register('githubUrl')} 
                placeholder="https://github.com/username"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none" 
              />
              {errors.githubUrl && <p className="text-rose-500 font-mono text-xs">{errors.githubUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Instagram URL</label>
              <input 
                {...register('instagramUrl')} 
                placeholder="https://instagram.com/username"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none" 
              />
              {errors.instagramUrl && <p className="text-rose-500 font-mono text-xs">{errors.instagramUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider block">Twitter / X URL</label>
              <input 
                {...register('twitterUrl')} 
                placeholder="https://twitter.com/username"
                className="w-full bg-surface-elevated border border-border rounded-xl p-3.5 text-text-primary focus:border-primary outline-none" 
              />
              {errors.twitterUrl && <p className="text-rose-500 font-mono text-xs">{errors.twitterUrl.message}</p>}
            </div>
          </div>
        </div>

        {/* Media & Files Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-primary font-bold border-b border-border pb-4">
            <FileText size={15} className="text-amber-400" />
            <span>CURRICULUM VITAE / RESUME DOCUMENT</span>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs text-text-muted uppercase tracking-wider block mb-2">Curriculum Vitae (PDF Document)</label>
            <FileUpload 
              value={cvUrl || ''} 
              onChange={(url) => setValue('cvFileUrl', url)}
              accept=".pdf"
              label="Upload CV (PDF)"
              folder="portfolio/cv"
            />
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl font-mono text-xs flex items-center gap-2 ${
            message.includes('success') 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-background rounded-2xl transition-all font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-target shadow-lg shadow-primary/20"
          >
            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>SAVE PROFILE SETTINGS</span>
          </button>
        </div>
      </form>
    </div>
  );
}
