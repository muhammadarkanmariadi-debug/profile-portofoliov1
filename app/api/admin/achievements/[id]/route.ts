import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { achievementSchema } from '@/lib/validations/achievement';

import { slugify } from '@/lib/utils/slug';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const body = await request.json();
    const validatedData = achievementSchema.parse(body);

    const finalSlug = validatedData.slug && validatedData.slug.trim() !== '' 
      ? slugify(validatedData.slug) 
      : slugify(validatedData.titleEn);

    const updatedAchievement = await prisma.achievement.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        titleId: validatedData.titleId || validatedData.titleEn,
        statusId: validatedData.statusId || validatedData.statusEn,
        descriptionId: validatedData.descriptionId ?? validatedData.descriptionEn,
        slug: finalSlug,
      },
    });

    return NextResponse.json(updatedAchievement);
  } catch (error: any) {
    console.error('Update achievement error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await prisma.achievement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete achievement error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
