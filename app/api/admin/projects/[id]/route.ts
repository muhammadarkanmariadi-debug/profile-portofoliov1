import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/validations/project';

import { slugify } from '@/lib/utils/slug';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    const { techStackIds, ...projectData } = validatedData;
    const finalSlug = projectData.slug && projectData.slug.trim() !== '' 
      ? slugify(projectData.slug) 
      : slugify(projectData.titleEn);

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...projectData,
        slug: finalSlug,
        techStack: {
          set: techStackIds.map((id) => ({ id })),
        },
      },
      include: {
        techStack: true,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error('Update project error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete project error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
