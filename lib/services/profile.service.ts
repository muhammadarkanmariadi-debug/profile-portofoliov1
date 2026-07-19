import { prisma } from '@/lib/prisma';
import type { Profile } from '@prisma/client';

const mockProfile: Profile = {
  id: 'mock-1',
  email: 'muhammadarkanm@gmail.com',
  phone: '+6281234567890',
  address: 'Jakarta, Indonesia',
  linkedinUrl: 'https://linkedin.com/in/muhammadarkanmariadi',
  githubUrl: 'https://github.com/arkanmariadi',
  instagramUrl: 'https://instagram.com/arkanmariadi',
  twitterUrl: 'https://twitter.com/arkanmariadi',
  lanyardImageUrl: '/images/arkan.jpg', // Fallback
  cvFileUrl: '/assets/CV_Muhammad_Arkan_Mariadi.pdf',
  shortDescriptionEn: 'Fullstack Developer with a passion for building scalable and user-friendly web applications.',
  shortDescriptionId: 'Developer Fullstack yang bersemangat membangun aplikasi web yang scalable dan user-friendly.',
  fullBiographyEn: 'I am a passionate developer focusing on the Javascript and Typescript ecosystem, mainly working with React, Next.js, Node.js, and databases like PostgreSQL/MySQL. I love crafting modern interfaces and reliable backend APIs.',
  fullBiographyId: 'Saya adalah seorang developer yang fokus pada ekosistem Javascript dan Typescript, terutama React, Next.js, Node.js, dan database seperti PostgreSQL/MySQL. Saya senang membuat antarmuka modern dan API backend yang andal.',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function getProfile(): Promise<Profile> {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) return mockProfile;
    return profile;
  } catch (error) {
    console.error('Database error in getProfile:', error);
    return mockProfile;
  }
}
