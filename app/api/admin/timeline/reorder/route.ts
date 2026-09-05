import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { items } = await request.json(); // Array of { id: string, order: number }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.timelineEntry.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath('/');
    revalidatePath('/about');

    return NextResponse.json({ success: true, count: items.length });
  } catch (error: any) {
    console.error('Reorder timeline error:', error);
    return NextResponse.json({ error: error.message || 'Failed to reorder timeline entries' }, { status: 500 });
  }
}
