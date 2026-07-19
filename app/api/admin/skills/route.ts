import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { skillSchema } from '@/lib/validations/skill';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = skillSchema.parse(body);

    const newSkill = await prisma.skill.create({
      data: validatedData,
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error: any) {
    console.error('Create skill error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
