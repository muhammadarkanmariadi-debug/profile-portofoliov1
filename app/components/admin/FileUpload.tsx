'use client';

import { useState } from 'react';
import { UploadCloud, X, File as FileIcon, Loader2, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  folder?: string;
}

export default function FileUpload({
  value,
  onChange,
  accept = "image/*",
  label = "Upload file",
  folder = "portfolio"
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const isImage = value?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) != null || (!value?.endsWith('.pdf') && value?.includes('image'));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('File size exceeds 8MB limit');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onChange(data.secure_url);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex flex-col items-start gap-3">
        {value ? (
          <div className="relative group w-full rounded-2xl overflow-hidden border border-border bg-surface-elevated p-3 shadow-sm">
            {isImage ? (
              <div className="flex items-center gap-4">
                <img 
                  src={value} 
                  alt="Upload preview" 
                  className="h-24 w-36 rounded-xl object-contain bg-background/50 border border-border" 
                />
                <div className="flex-1 truncate pr-8 font-mono text-xs text-text-muted">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <CheckCircle2 size={13} />
                    <span>FILE ATTACHED</span>
                  </div>
                  <span className="truncate block opacity-80">{value.split('/').pop()}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <FileIcon size={24} />
                </div>
                <div className="flex-1 truncate pr-8 font-mono text-xs">
                  <div className="text-text-primary font-bold truncate">{value.split('/').pop()}</div>
                  <span className="text-emerald-400 text-[11px]">PDF Document Ready</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-3 right-3 p-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-target opacity-80 group-hover:opacity-100"
              title="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border hover:border-primary/50 bg-surface-elevated hover:bg-surface rounded-2xl transition-all cursor-pointer group">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              {isUploading ? (
                <Loader2 className="w-7 h-7 text-primary animate-spin mb-2" />
              ) : (
                <UploadCloud className="w-7 h-7 text-text-muted group-hover:text-primary transition-colors mb-2" />
              )}
              <p className="text-xs font-mono text-text-muted">
                {isUploading ? (
                  <span className="text-primary font-bold">Uploading asset to cloud...</span>
                ) : (
                  <>
                    <span className="font-bold text-text-primary group-hover:text-primary transition-colors">{label}</span>
                    <span className="block text-[11px] text-text-muted mt-0.5">Click or drag & drop file</span>
                  </>
                )}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        )}

        {error && <p className="text-xs font-mono text-rose-400">{error}</p>}
      </div>
    </div>
  );
}
