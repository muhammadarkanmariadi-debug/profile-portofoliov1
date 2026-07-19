import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { achievementSchema } from '@/lib/validations/achievement';

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: [
        { order: 'asc' },
        { date: 'desc' },
      ],
    });
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = achievementSchema.parse(body);

    const newAchievement = await prisma.achievement.create({
      data: validatedData,
    });

    return NextResponse.json(newAchievement, { status: 201 });
  } catch (error: any) {
    console.error('Create achievement error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}
