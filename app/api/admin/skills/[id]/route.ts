import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { skillSchema } from '@/lib/validations/skill';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const body = await request.json();
    const validatedData = skillSchema.parse(body);

    const updatedSkill = await prisma.skill.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedSkill);
  } catch (error: any) {
    console.error('Update skill error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await prisma.skill.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete skill error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
