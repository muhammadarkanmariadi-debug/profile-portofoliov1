import { prisma } from '@/lib/prisma';
import type { TimelineEntry } from '@prisma/client';

const mockTimeline: TimelineEntry[] = [
  {
    id: 'mock-t1',
    type: 'EDUCATION',
    titleEn: 'SMKN 1 Jakarta',
    titleId: 'SMKN 1 Jakarta',
    categoryEn: 'Software Engineering',
    categoryId: 'Rekayasa Perangkat Lunak',
    descriptionEn: 'Focused on programming and software development fundamentals.',
    descriptionId: 'Fokus pada dasar-dasar pemrograman dan pengembangan perangkat lunak.',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-t2',
    type: 'EXPERIENCE',
    titleEn: 'Frontend Developer Intern',
    titleId: 'Magang Frontend Developer',
    categoryEn: 'Tech Company',
    categoryId: 'Perusahaan Teknologi',
    descriptionEn: 'Developed responsive user interfaces using React and Next.js.',
    descriptionId: 'Mengembangkan antarmuka pengguna yang responsif menggunakan React dan Next.js.',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export async function getTimeline(): Promise<TimelineEntry[]> {
  try {
    const timeline = await prisma.timelineEntry.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    
    if (timeline.length === 0) return mockTimeline;
    return timeline;
  } catch (error) {
    console.error('Database error in getTimeline:', error);
    return mockTimeline;
  }
}
