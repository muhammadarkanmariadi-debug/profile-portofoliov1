import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        techStack: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to fetch project detail:', error);
    return NextResponse.json({ error: 'Failed to fetch project detail' }, { status: 500 });
  }
}
