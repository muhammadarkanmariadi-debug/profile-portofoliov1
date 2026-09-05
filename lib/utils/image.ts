/**
 * Sanitizes and formats image asset URLs for Cloudinary and external CDN sources
 */
export function getOptimizedImageUrl(url: string | null | undefined, fallback: string = ''): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const cleanUrl = url.trim();

  // If URL is an HTTP Cloudinary asset, upgrade to HTTPS
  if (cleanUrl.startsWith('http://res.cloudinary.com/')) {
    return cleanUrl.replace('http://', 'https://');
  }

  return cleanUrl;
}
