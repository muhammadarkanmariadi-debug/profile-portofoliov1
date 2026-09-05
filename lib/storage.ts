import cloudinary from '@/lib/cloudinary';

export interface UploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  bytes?: number;
  format?: string;
  storage: 'cloudinary';
}

/**
 * Validates that required Cloudinary environment variables are set
 */
export function validateCloudinaryConfig(): void {
  const missing: string[] = [];
  if (!process.env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!process.env.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
  if (!process.env.CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET');

  if (missing.length > 0) {
    throw new Error(
      `Cloudinary configuration missing: ${missing.join(', ')}. Please configure these environment variables in your .env or docker-compose.yml.`
    );
  }
}

/**
 * Uploads an asset (image, document, PDF) directly to Cloudinary with detailed error reporting
 */
export async function uploadAsset(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'portfolio'
): Promise<UploadResult> {
  // 1. Verify credentials configuration
  validateCloudinaryConfig();

  if (!buffer || buffer.length === 0) {
    throw new Error('Upload error: File buffer is empty or corrupted (0 bytes).');
  }

  const isPdf = contentType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '');

  return new Promise<UploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: cleanFolder,
        resource_type: isPdf ? 'raw' : 'auto',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]', error);
          const errorMsg = error.message || error.toString();
          const httpCode = (error as any).http_code ? ` (HTTP ${(error as any).http_code})` : '';
          reject(new Error(`Cloudinary Upload Failed${httpCode}: ${errorMsg}`));
        } else if (!result || !result.secure_url) {
          reject(new Error('Cloudinary response did not contain a valid secure_url.'));
        } else {
          resolve({
            url: result.secure_url || result.url,
            secure_url: result.secure_url || result.url,
            public_id: result.public_id,
            bytes: result.bytes,
            format: result.format,
            storage: 'cloudinary',
          });
        }
      }
    );

    uploadStream.on('error', (streamErr: any) => {
      console.error('[Upload Stream Error]', streamErr);
      reject(new Error(`Upload stream failed: ${streamErr.message || streamErr}`));
    });

    uploadStream.end(buffer);
  });
}
