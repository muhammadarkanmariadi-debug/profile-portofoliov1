import { prisma } from '@/lib/prisma';
import type { Skill } from '@prisma/client';

const mockSkills: Skill[] = [
  {
    id: 'mock-s1',
    category: 'FRONTEND',
    title: 'React',
    logoUrl: null,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-s2',
    category: 'BACKEND',
    title: 'Node.js',
    logoUrl: null,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export async function getSkills(): Promise<Skill[]> {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    
    if (skills.length === 0) return mockSkills;
    return skills;
  } catch (error) {
    console.error('Database error in getSkills:', error);
    return mockSkills;
  }
}
