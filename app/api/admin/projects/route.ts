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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    const { techStackIds, ...projectData } = validatedData;

    const newProject = await prisma.project.create({
      data: {
        ...projectData,
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
