import { prisma } from '@/lib/prisma';
import type { Achievement } from '@prisma/client';
import { slugify } from '@/lib/utils/slug';

const mockAchievements: Achievement[] = [
  {
    id: 'mock-a1',
    slug: 'outstanding-project-award',
    titleEn: 'Outstanding Project Award',
    titleId: 'Penghargaan Proyek Luar Biasa',
    statusEn: 'Winner',
    statusId: 'Pemenang',
    descriptionEn: 'Awarded for the best overall project implementation.',
    descriptionId: 'Diberikan untuk implementasi proyek terbaik secara keseluruhan.',
    date: new Date(),
    imageUrl: null,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: [
        { order: 'asc' },
        { date: 'desc' },
      ],
    });
    
    if (achievements.length === 0) return mockAchievements;
    return achievements;
  } catch (error) {
    console.error('Database error in getAchievements:', error);
    return mockAchievements;
  }
}

export async function getAchievementBySlug(slugOrId: string): Promise<Achievement | null> {
  if (!slugOrId) return null;
  const decoded = decodeURIComponent(slugOrId).trim();
  const isUUID = UUID_REGEX.test(decoded);

  try {
    // 1. If it's a valid UUID, search by ID first
    if (isUUID) {
      const byId = await prisma.achievement.findUnique({
        where: { id: decoded },
      });
      if (byId) return byId;
    }

    // 2. Try searching by slug
    const bySlug = await prisma.achievement.findFirst({
      where: { slug: decoded },
    });
    if (bySlug) return bySlug;

    // 3. Fallback: match by slugified title in DB
    const allAchievements = await prisma.achievement.findMany();
    const matching = allAchievements.find(
      a => (a.slug && a.slug === decoded) ||
           (a.titleEn && slugify(a.titleEn) === decoded) ||
           a.id === decoded
    );
    if (matching) return matching;

    // 4. Fallback to mock achievements
    const fallback = mockAchievements.find(
      a => a.slug === decoded || a.id === decoded || (a.titleEn && slugify(a.titleEn) === decoded)
    );
    return fallback || null;
  } catch (error) {
    console.error('Database error in getAchievementBySlug:', error);
    const fallback = mockAchievements.find(
      a => a.slug === decoded || a.id === decoded || (a.titleEn && slugify(a.titleEn) === decoded)
    );
    return fallback || null;
  }
}
