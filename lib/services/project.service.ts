import { prisma } from '@/lib/prisma';
import type { Project, Skill } from '@prisma/client';
import { slugify } from '@/lib/utils/slug';

export type ProjectWithTech = Project & { techStack: Skill[] };

const mockProjects: ProjectWithTech[] = [
  {
    id: 'mock-p1',
    slug: 'gigtix-ticketing-app',
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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getProjects(limit?: number): Promise<ProjectWithTech[]> {
  try {
    const projects = await prisma.project.findMany({
      include: {
        techStack: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      ...(limit ? { take: limit } : {}),
    });
    
    if (projects.length === 0) return limit ? mockProjects.slice(0, limit) : mockProjects;
    return projects;
  } catch (error) {
    console.error('Database error in getProjects:', error);
    return limit ? mockProjects.slice(0, limit) : mockProjects;
  }
}

export async function getProjectBySlug(slugOrId: string): Promise<ProjectWithTech | null> {
  if (!slugOrId) return null;
  const decoded = decodeURIComponent(slugOrId).trim();
  const isUUID = UUID_REGEX.test(decoded);

  try {
    // 1. If it's a valid UUID, search by ID first or slug
    if (isUUID) {
      const byId = await prisma.project.findUnique({
        where: { id: decoded },
        include: { techStack: true },
      });
      if (byId) return byId;
    }

    // 2. Try searching by slug
    const bySlug = await prisma.project.findFirst({
      where: { slug: decoded },
      include: { techStack: true },
    });
    if (bySlug) return bySlug;

    // 3. Fallback: match by slugified title in DB
    const allProjects = await prisma.project.findMany({
      include: { techStack: true },
    });
    
    const matchingProject = allProjects.find(
      p => (p.slug && p.slug === decoded) ||
           (p.titleEn && slugify(p.titleEn) === decoded) ||
           p.id === decoded
    );

    if (matchingProject) return matchingProject;

    // 4. Fallback to mock projects
    const fallback = mockProjects.find(
      p => p.slug === decoded || p.id === decoded || (p.titleEn && slugify(p.titleEn) === decoded)
    );
    return fallback || null;
  } catch (error) {
    console.error('Database error in getProjectBySlug:', error);
    const fallback = mockProjects.find(
      p => p.slug === decoded || p.id === decoded || (p.titleEn && slugify(p.titleEn) === decoded)
    );
    return fallback || null;
  }
}
