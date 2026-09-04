import { prisma } from '@/lib/prisma';
import type { TimelineEntry } from '@prisma/client';

const mockTimeline: TimelineEntry[] = [
  {
    id: 'mock-t1',
    type: 'EDUCATION',
    title: 'SMK Telkom Malang',
    category: '2023 - 2026',
    description: 'Software Engineering Major (Rekayasa Perangkat Lunak). Focus on full-stack web engineering, database architecture, cloud infrastructure, and agile software development.',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-t2',
    type: 'EDUCATION',
    title: 'SMPN 3 Singosari',
    category: '2020 - 2023',
    description: 'Junior High School graduate with academic excellence and national language competition awards.',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-t3',
    type: 'EXPERIENCE',
    title: 'PIC Studio Musik — Moklet Art Club (MAC)',
    category: '2024 - Present',
    description: 'Managing high-grade digital audio equipment, studio infrastructure maintenance, booking schedules, and live recording setups.',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-t4',
    type: 'EXPERIENCE',
    title: 'Equipment & FOH Lead — MAC A Rhythm',
    category: '2024',
    description: 'Coordinated front-of-house (FOH) stage audio engineering, signal routing, and technical equipment logistics for live multi-artist showcase.',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-t5',
    type: 'EXPERIENCE',
    title: 'Technical Sound Engineer — Ruang Kita',
    category: '2024',
    description: 'Operated stage audio engineering consoles, monitored live acoustic balances, and managed stage power distribution.',
    order: 3,
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
