import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort'); // stars | updated | order
    const syncSource = searchParams.get('syncSource'); // github | manual
    const excludeArchived = searchParams.get('excludeArchived') === 'true';

    const where: any = {};
    
    if (syncSource) {
      where.syncSource = syncSource;
    }
    
    if (excludeArchived) {
      where.isArchived = false;
    }

    let orderBy: any[] = [{ order: 'asc' }, { createdAt: 'desc' }];
    
    if (sort === 'stars') {
      orderBy = [{ starsCount: 'desc' }, ...orderBy];
    } else if (sort === 'updated') {
      orderBy = [{ pushedAt: 'desc'}, { updatedAt: 'desc' }, ...orderBy];
    } else if (sort === 'order') {
      orderBy = [{ order: 'asc' }, { createdAt: 'desc' }];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        techStack: true, // Included via Prisma relational query
      },
      orderBy,
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

