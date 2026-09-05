import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { items } = await request.json(); // Array of { id: string, order: number, category?: string }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item: { id: string; order: number; category?: any }) =>
        prisma.skill.update({
          where: { id: item.id },
          data: { 
            order: item.order,
            ...(item.category ? { category: item.category } : {})
          },
        })
      )
    );

    revalidatePath('/');
    revalidatePath('/skills');

    return NextResponse.json({ success: true, count: items.length });
  } catch (error: any) {
    console.error('Reorder skills error:', error);
    return NextResponse.json({ error: error.message || 'Failed to reorder skills' }, { status: 500 });
  }
}
