import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import cloudinary from '@/lib/cloudinary';

// Check if MinIO environment is configured
export const isMinioConfigured = (): boolean => {
  return Boolean(
    (process.env.MINIO_ENDPOINT || process.env.S3_ENDPOINT) &&
    (process.env.MINIO_ACCESS_KEY || process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER) &&
    (process.env.MINIO_SECRET_KEY || process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD)
  );
};

// Singleton S3 / MinIO client
let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
  if (s3ClientInstance) return s3ClientInstance;

  const endpoint = process.env.MINIO_ENDPOINT || process.env.S3_ENDPOINT || 'http://127.0.0.1:9000';
  const accessKeyId = process.env.MINIO_ACCESS_KEY || process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER || '';
  const secretAccessKey = process.env.MINIO_SECRET_KEY || process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD || '';
  const region = process.env.MINIO_REGION || process.env.S3_REGION || 'us-east-1';
  const useSSL = process.env.MINIO_USE_SSL === 'true' || endpoint.startsWith('https');

  s3ClientInstance = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true, // Required for MinIO
    tls: useSSL,
  });

  return s3ClientInstance;
}

/**
 * Ensures the target MinIO bucket exists and has public read access policy
 */
async function ensureBucketExists(s3: S3Client, bucket: string) {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      try {
        await s3.send(new CreateBucketCommand({ Bucket: bucket }));
        
        // Set public read bucket policy for direct web display
        const publicPolicy = {
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'PublicRead',
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        };

        await s3.send(
          new PutBucketPolicyCommand({
            Bucket: bucket,
            Policy: JSON.stringify(publicPolicy),
          })
        );
      } catch (createErr) {
        console.warn('Could not auto-create MinIO bucket or policy:', createErr);
      }
    }
  }
}

export interface UploadResult {
  url: string;
  secure_url: string;
  public_id?: string;
  bytes?: number;
  format?: string;
  storage: 'minio' | 'cloudinary';
}

/**
 * Universal upload helper: Uploads to self-hosted MinIO first, or falls back to Cloudinary
 */
export async function uploadAsset(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'portfolio'
): Promise<UploadResult> {
  // 1. MinIO Self-Hosted Upload
  if (isMinioConfigured()) {
    const s3 = getS3Client();
    const bucket = process.env.MINIO_BUCKET || process.env.S3_BUCKET || 'portfolio';
    await ensureBucketExists(s3, bucket);

    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = cleanFolder ? `${cleanFolder}/${Date.now()}-${cleanFileName}` : `${Date.now()}-${cleanFileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType || 'application/octet-stream',
      })
    );

    // Build public URL
    const rawEndpoint = process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT || process.env.S3_ENDPOINT || 'http://127.0.0.1:9000';
    const publicBase = rawEndpoint.replace(/\/+$/, '');
    
    // If publicBase already includes bucket name or custom CDN
    const finalUrl = process.env.MINIO_PUBLIC_URL
      ? `${publicBase}/${key}`
      : `${publicBase}/${bucket}/${key}`;

    return {
      url: finalUrl,
      secure_url: finalUrl,
      public_id: key,
      bytes: buffer.length,
      storage: 'minio',
    };
  }

  // 2. Cloudinary Upload (Fallback)
  const isPdf = contentType === 'application/pdf';
  const uploadResponse = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isPdf ? 'raw' : 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(buffer);
  });

  return {
    url: uploadResponse.url,
    secure_url: uploadResponse.secure_url,
    public_id: uploadResponse.public_id,
    bytes: uploadResponse.bytes,
    format: uploadResponse.format,
    storage: 'cloudinary',
  };
}
