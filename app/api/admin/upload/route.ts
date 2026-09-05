import { NextResponse } from 'next/server';
import { uploadAsset } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'portfolio';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data. Please select a file.' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: 'The selected file is empty (0 bytes).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await uploadAsset(
      buffer,
      file.name,
      file.type,
      folder
    );

    return NextResponse.json({
      success: true,
      ...uploadResponse,
    });
  } catch (error: any) {
    console.error('[API /api/admin/upload] Error:', error);
    const errorMessage = error?.message || 'Unknown error occurred during asset upload';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
