'use client';

import { useState } from 'react';
import { UploadCloud, X, File as FileIcon, Loader2 } from 'lucide-react';

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

  const isImage = value?.match(/\.(jpeg|jpg|gif|png)$/) != null || (!value?.endsWith('.pdf') && value?.includes('image'));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
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
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex flex-col items-start gap-4">
        {value ? (
          <div className="relative group w-full rounded-xl overflow-hidden border border-white/10 bg-white/5 p-2">
            {isImage ? (
              <img src={value} alt="Upload preview" className="max-h-48 rounded-lg object-contain bg-black/50" />
            ) : (
              <div className="flex items-center gap-3 p-4">
                <FileIcon size={32} className="text-primary" />
                <span className="text-sm truncate text-gray-300">{value.split('/').pop()}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl hover:border-primary/50 hover:bg-white/5 transition-all ">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
              ) : (
                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              )}
              <p className="text-sm text-gray-400">
                {isUploading ? 'Uploading...' : <><span className="font-semibold text-primary">{label}</span> or drag and drop</>}
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

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
