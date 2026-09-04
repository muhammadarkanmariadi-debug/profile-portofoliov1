import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { timelineSchema } from '@/lib/validations/timeline';

export async function GET() {
  try {
    const timeline = await prisma.timelineEntry.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return NextResponse.json(timeline);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = timelineSchema.parse(body);

    const newEntry = await prisma.timelineEntry.create({
      data: validatedData,
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error: any) {
    console.error('Create timeline error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create timeline entry' }, { status: 500 });
  }
}
