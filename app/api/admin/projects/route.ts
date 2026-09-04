import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/validations/project';

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

import { slugify } from '@/lib/utils/slug';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    const { techStackIds, ...projectData } = validatedData;
    const finalSlug = projectData.slug && projectData.slug.trim() !== '' 
      ? slugify(projectData.slug) 
      : slugify(projectData.titleEn);

    const newProject = await prisma.project.create({
      data: {
        ...projectData,
        categoryId: projectData.categoryId || projectData.categoryEn,
        titleId: projectData.titleId || projectData.titleEn,
        descriptionId: projectData.descriptionId ?? projectData.descriptionEn,
        roleId: projectData.roleId ?? projectData.roleEn,
        slug: finalSlug,
        techStack: {
          connect: techStackIds.map((id) => ({ id })),
        },
      },
      include: {
        techStack: true,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
