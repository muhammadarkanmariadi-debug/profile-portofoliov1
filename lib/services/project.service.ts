import { prisma } from '@/lib/prisma';
import type { Project, Skill } from '@prisma/client';
import { slugify } from '@/lib/utils/slug';
import { redisGet, redisSet, redisDelByPattern } from '@/lib/redis';

export type ProjectWithTech = Project & { techStack: Skill[] };

const CACHE_TTL = Number(process.env.REDIS_CACHE_TTL || 3600); // 1 hour

const mockProjects: ProjectWithTech[] = [
  {
    id: 'mock-p1',
    slug: 'profile-portofoliov1',
    category: 'Digital Portfolio & Headless CMS',
    title: '4RK4N.DEV Portfolio',
    description: 'Awwwards-grade digital portfolio and Headless CMS featuring 3D WebGL physics, kinetic typography, Redis caching, and automated GitHub repository synchronization.',
    role: 'Full-Stack Software Engineer & Creative Developer',
    isDeploy: true,
    liveUrl: 'https://4rkan.dev',
    sourceCodeUrl: 'https://github.com/muhammadarkanmariadi-debug/profile-portofoliov1',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    order: 1,
    githubId: null,
    githubFullName: null,
    readmeContent: null,
    primaryLanguage: 'TypeScript',
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
        logoUrl: 'https://img.icons8.com/color/512/nextjs.png',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
  }
];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Invalidate all Redis cache keys related to projects
 */
export async function invalidateProjectsCache(slugOrId?: string): Promise<void> {
  try {
    await redisDelByPattern('projects:*');
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Redis Cache] Invalidated projects cache${slugOrId ? ` for ${slugOrId}` : ''}`);
    }
  } catch (error) {
    console.warn('[Redis Cache] Invalidation error:', error);
  }
}

export async function getProjects(limit?: number): Promise<ProjectWithTech[]> {
  const cacheKey = `projects:list:${limit ?? 'all'}`;

  // 1. Try Redis cache first
  try {
    const cached = await redisGet<ProjectWithTech[]>(cacheKey);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch (err) {
    // Non-blocking fallback
  }

  // 2. Fetch from Database
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
    
    const result = projects.length === 0 ? (limit ? mockProjects.slice(0, limit) : mockProjects) : projects;

    // 3. Cache the result in Redis
    if (projects.length > 0) {
      await redisSet(cacheKey, result, CACHE_TTL);
    }

    return result;
  } catch (error) {
    console.error('Database error in getProjects:', error);
    return limit ? mockProjects.slice(0, limit) : mockProjects;
  }
}

export async function getProjectBySlug(slugOrId: string): Promise<ProjectWithTech | null> {
  if (!slugOrId) return null;
  const decoded = decodeURIComponent(slugOrId).trim();
  const isUUID = UUID_REGEX.test(decoded);
  const cacheKey = `projects:detail:${decoded}`;

  // 1. Try Redis cache first
  try {
    const cached = await redisGet<ProjectWithTech>(cacheKey);
    if (cached) {
      return cached;
    }
  } catch (err) {
    // Non-blocking fallback
  }

  // 2. Query from Database
  try {
    let project: ProjectWithTech | null = null;

    // A. If it's a valid UUID, search by ID first
    if (isUUID) {
      project = await prisma.project.findUnique({
        where: { id: decoded },
        include: { techStack: true },
      });
    }

    // B. Try searching by slug
    if (!project) {
      project = await prisma.project.findFirst({
        where: { slug: decoded },
        include: { techStack: true },
      });
    }

    // C. Fallback: match by slugified title in DB
    if (!project) {
      const allProjects = await prisma.project.findMany({
        include: { techStack: true },
      });
      
      project = allProjects.find(
        p => (p.slug && p.slug === decoded) ||
             (p.title && slugify(p.title) === decoded) ||
             p.id === decoded
      ) || null;
    }

    // D. Fallback to mock projects if DB is empty
    if (!project) {
      const fallback = mockProjects.find(
        p => p.slug === decoded || p.id === decoded || (p.title && slugify(p.title) === decoded)
      );
      return fallback || null;
    }

    // 3. Cache in Redis
    await redisSet(cacheKey, project, CACHE_TTL);

    return project;
  } catch (error) {
    console.error('Database error in getProjectBySlug:', error);
    const fallback = mockProjects.find(
      p => p.slug === decoded || p.id === decoded || (p.title && slugify(p.title) === decoded)
    );
    return fallback || null;
  }
}
