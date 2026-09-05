import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { invalidateProjectsCache } from '@/lib/services/project.service';

export async function POST(request: Request) {
  try {
    const { items } = await request.json(); // Array of { id: string, order: number }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    // Execute bulk update in a transaction
    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.project.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    // Invalidate Redis cache & Server Components
    await invalidateProjectsCache();
    revalidatePath('/');
    revalidatePath('/projects');

    return NextResponse.json({ success: true, count: items.length });
  } catch (error: any) {
    console.error('Reorder projects error:', error);
    return NextResponse.json({ error: error.message || 'Failed to reorder projects' }, { status: 500 });
  }
}
