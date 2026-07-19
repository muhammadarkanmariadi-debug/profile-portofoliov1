import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { timelineSchema } from '@/lib/validations/timeline';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const body = await request.json();
    const validatedData = timelineSchema.parse(body);

    const updatedEntry = await prisma.timelineEntry.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedEntry);
  } catch (error: any) {
    console.error('Update timeline error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Timeline entry not found' }, { status: 404 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update timeline entry' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await prisma.timelineEntry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete timeline error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Timeline entry not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete timeline entry' }, { status: 500 });
  }
}
