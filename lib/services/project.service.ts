import { prisma } from '@/lib/prisma';
import type { Project, Skill } from '@prisma/client';

export type ProjectWithTech = Project & { techStack: Skill[] };

const mockProjects: ProjectWithTech[] = [
  {
    id: 'mock-p1',
    categoryEn: 'Web App',
    categoryId: 'Aplikasi Web',
    titleEn: 'GigTix Ticketing App',
    titleId: 'Aplikasi Tiket GigTix',
    descriptionEn: 'A modern ticketing platform for events.',
    descriptionId: 'Platform pemesanan tiket modern untuk acara.',
    roleEn: 'Fullstack Developer',
    roleId: 'Pengembang Fullstack',
    isDeploy: false,
    liveUrl: null,
    sourceCodeUrl: null,
    imageUrl: null,
    order: 1,
    githubId: null,
    githubFullName: null,
    readmeContent: null,
    primaryLanguage: null,
    starsCount: 0,
    isFork: false,
    isArchived: false,
    pushedAt: null,
    lastSyncedAt: null,
    syncSource: 'manual',
    createdAt: new Date(),
    updatedAt: new Date(),
    techStack: [
      {
        id: 'mock-s1',
        category: 'FRONTEND',
        title: 'Next.js',
        logoUrl: null,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
  }
];

export async function getProjects(): Promise<ProjectWithTech[]> {
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
    
    if (projects.length === 0) return mockProjects;
    return projects;
  } catch (error) {
    console.error('Database error in getProjects:', error);
    return mockProjects;
  }
}
