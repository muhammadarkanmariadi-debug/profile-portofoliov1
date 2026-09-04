import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/validations/project';
import { slugify } from '@/lib/utils/slug';
import { invalidateProjectsCache } from '@/lib/services/project.service';

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
      : slugify(projectData.title);

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

    // Invalidate Redis Cache & Next.js Server Components
    await invalidateProjectsCache(params.id);
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath(`/projects/${finalSlug}`);

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
    const existing = await prisma.project.findUnique({
      where: { id: params.id },
      select: { slug: true }
    });

    await prisma.project.delete({
      where: { id: params.id },
    });

    // Invalidate Redis Cache & Next.js Server Components
    await invalidateProjectsCache(params.id);
    revalidatePath('/');
    revalidatePath('/projects');
    if (existing?.slug) {
      revalidatePath(`/projects/${existing.slug}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete project error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
