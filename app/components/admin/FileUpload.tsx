'use client';

import { useState } from 'react';
import { 
  UploadCloud, 
  X, 
  File as FileIcon, 
  Loader2, 
  CheckCircle2, 
  Eye, 
  ExternalLink, 
  Link as LinkIcon, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/utils/image';

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
  const [imgError, setImgError] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');

  const displayUrl = getOptimizedImageUrl(value);
  const isPdf = Boolean(
    value?.toLowerCase().endsWith('.pdf') ||
    value?.toLowerCase().includes('.pdf?') ||
    (accept.includes('pdf') && !accept.includes('image'))
  );
  const isImage = Boolean(!isPdf && value);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds 15MB limit');
      return;
    }

    setIsUploading(true);
    setError('');
    setImgError(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        if (res.status === 413) {
          throw new Error('Upload failed: File size too large for web server (Nginx 413). Increase client_max_body_size in Nginx configuration.');
        } else if (res.status === 401) {
          throw new Error('Upload failed: Session unauthorized or expired (401). Please re-login.');
        } else {
          const match = text.match(/<title>(.*?)<\/title>/i) || text.match(/<h1>(.*?)<\/h1>/i);
          const errorDetail = match ? match[1] : text.slice(0, 80);
          throw new Error(`Server returned HTTP ${res.status}: ${errorDetail}`);
        }
      }

      if (!res.ok) {
        throw new Error(data?.error || `Upload failed with status ${res.status}`);
      }

      onChange(data.secure_url || data.url);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setUrlDraft('');
      setShowUrlInput(false);
      setImgError(false);
    }
  };

  return (
    <div className="space-y-3 w-full">
      {/* Uploaded File View Card */}
      {value ? (
        <div className="relative group w-full rounded-2xl overflow-hidden border border-border bg-surface-elevated p-3.5 shadow-sm transition-all hover:border-primary/40">
          {isImage ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Thumbnail with overlay controls */}
              <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-background/80 border border-border flex items-center justify-center shrink-0">
                {!imgError ? (
                  <img 
                    src={displayUrl} 
                    alt="Upload preview" 
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-center" 
                  />
                ) : (
                  <div className="p-3 text-center font-mono text-[10px] text-amber-400 flex flex-col items-center gap-1">
                    <AlertCircle size={18} />
                    <span>PREVIEW BLOCKED</span>
                  </div>
                )}

                {/* Quick overlay actions on thumbnail */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => setShowLightbox(true)}
                    className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-black rounded-lg transition-colors cursor-target"
                    title="Expand View"
                  >
                    <Eye size={14} />
                  </button>
                  <a
                    href={displayUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-black rounded-lg transition-colors cursor-target"
                    title="Open full image in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* File details & URL meta */}
              <div className="flex-1 min-w-0 pr-10 font-mono text-xs text-text-muted space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 size={13} />
                  <span>IMAGE ASSET READY</span>
                </div>
                <p className="text-text-primary text-xs truncate font-bold font-sans">
                  {value.split('/').pop() || 'Asset File'}
                </p>
                <p className="text-[11px] text-text-muted truncate opacity-70">
                  {value}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2">
              <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <FileIcon size={24} />
              </div>
              <div className="flex-1 min-w-0 pr-10 font-mono text-xs">
                <div className="text-text-primary font-bold truncate font-sans">{value.split('/').pop()}</div>
                <span className="text-emerald-400 text-[11px]">PDF Document Ready</span>
                <a 
                  href={displayUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block text-primary hover:underline text-[11px] truncate mt-0.5 cursor-target"
                >
                  View Document ↗
                </a>
              </div>
            </div>
          )}

          {/* Remove / Reset Button */}
          <button
            type="button"
            onClick={() => {
              onChange('');
              setImgError(false);
            }}
            className="absolute top-3 right-3 p-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-target shadow-sm"
            title="Remove asset"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div className="space-y-2">
          {!showUrlInput ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border hover:border-primary/50 bg-surface-elevated hover:bg-surface rounded-2xl transition-all cursor-pointer group">
              <div className="flex flex-col items-center justify-center p-4 text-center">
                {isUploading ? (
                  <Loader2 className="w-7 h-7 text-primary animate-spin mb-2" />
                ) : (
                  <UploadCloud className="w-7 h-7 text-text-muted group-hover:text-primary transition-colors mb-2" />
                )}
                <p className="text-xs font-mono text-text-muted">
                  {isUploading ? (
                    <span className="text-primary font-bold">Uploading asset to storage...</span>
                  ) : (
                    <>
                      <span className="font-bold text-text-primary group-hover:text-primary transition-colors">{label}</span>
                      <span className="block text-[11px] text-text-muted mt-0.5">Click to browse or drag & drop</span>
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
          ) : (
            <div className="bg-surface-elevated border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs text-text-muted">
                <span>Enter Direct Image URL</span>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="text-text-muted hover:text-text-primary"
                >
                  Cancel
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 bg-surface border border-border rounded-xl px-3.5 py-2 font-mono text-xs text-text-primary focus:border-primary outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2 bg-primary text-background font-mono text-xs font-bold rounded-xl cursor-target"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Toggle manual URL input */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="font-mono text-[11px] text-text-muted hover:text-primary transition-colors flex items-center gap-1 cursor-target"
            >
              <LinkIcon size={12} />
              <span>{showUrlInput ? 'Back to File Upload' : 'Or paste URL directly'}</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl font-mono text-xs flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Lightbox / Expanded Modal Preview */}
      {showLightbox && isImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setShowLightbox(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[85vh] bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/80 font-mono text-xs text-text-muted">
              <span className="truncate pr-4">{value}</span>
              <button
                type="button"
                onClick={() => setShowLightbox(false)}
                className="p-1.5 hover:bg-surface-elevated rounded-lg text-text-primary cursor-target"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img 
                src={displayUrl} 
                alt="Full Preview" 
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
