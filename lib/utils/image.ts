/**
 * Sanitizes and resolves public image/asset URLs for self-hosted MinIO and remote CDNs
 */
export function getOptimizedImageUrl(url: string | null | undefined, fallback: string = ''): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const cleanUrl = url.trim();

  // If in browser and URL points to internal docker hostname (http://minio:9000 or http://minio:...)
  if (typeof window !== 'undefined' && (cleanUrl.includes('://minio:') || cleanUrl.includes('://minio/'))) {
    try {
      const parsed = new URL(cleanUrl);
      const host = window.location.hostname || 'localhost';
      const protocol = window.location.protocol || 'http:';
      // MinIO S3 API is exposed on host port 9005
      return `${protocol}//${host}:9005${parsed.pathname}${parsed.search}`;
    } catch {
      return cleanUrl.replace(/:\/\/minio(:\d+)?\//, '://localhost:9005/');
    }
  }

  return cleanUrl;
}
