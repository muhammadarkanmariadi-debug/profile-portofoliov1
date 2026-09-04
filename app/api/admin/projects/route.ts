import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/validations/project';
import { slugify } from '@/lib/utils/slug';
import { invalidateProjectsCache } from '@/lib/services/project.service';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        techStack: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    const { techStackIds, ...projectData } = validatedData;
    const finalSlug = projectData.slug && projectData.slug.trim() !== '' 
      ? slugify(projectData.slug) 
      : slugify(projectData.title);

    const newProject = await prisma.project.create({
      data: {
        ...projectData,
        slug: finalSlug,
        techStack: {
          connect: techStackIds.map((id) => ({ id })),
        },
      },
      include: {
        techStack: true,
      },
    });

    // Invalidate Redis Cache & Next.js Server Components
    await invalidateProjectsCache();
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath(`/projects/${finalSlug}`);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
