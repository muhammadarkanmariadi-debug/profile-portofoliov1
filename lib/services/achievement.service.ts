import { prisma } from '@/lib/prisma';
import type { Achievement } from '@prisma/client';

const mockAchievements: Achievement[] = [
  {
    id: 'mock-a1',
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
