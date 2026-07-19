import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      totalProjects,
      totalSkills,
      totalAchievements,
      totalMessages,
      unreadMessages
    ] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.achievement.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({
        where: { isRead: false }
      })
    ]);

    return NextResponse.json({
      totalProjects,
      totalSkills,
      totalAchievements,
      totalMessages,
      unreadMessages
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
