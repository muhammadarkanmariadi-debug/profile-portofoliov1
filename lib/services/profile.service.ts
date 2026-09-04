import { prisma } from '@/lib/prisma';
import type { Profile } from '@prisma/client';

const mockProfile: Profile = {
  id: 'mock-1',
  email: 'muhammadarkanmariadi@gmail.com',
  phone: '+62-821-3273-6902',
  address: 'Malang, East Java, Indonesia',
  linkedinUrl: 'https://linkedin.com/in/arkanmariadi',
  githubUrl: 'https://github.com/muhammadarkanmariadi-debug',
  instagramUrl: 'https://instagram.com/arkanmariadi',
  twitterUrl: 'https://twitter.com/arkanmariadi',
  lanyardImageUrl: 'https://images.unsplash.com/photo-1590402494682-bf34f5ce8c50?w=800&auto=format&fit=crop&q=60',
  cvFileUrl: '/assets/CV_Muhammad_Arkan_Mariadi.pdf',
  shortDescription: 'Full-Stack Developer & Software Engineering Student at SMK Telkom Malang specializing in Next.js, Nest.js, Laravel, and cloud architectures.',
  fullBiography: 'I am a Full-Stack Software Engineer currently studying at SMK Telkom Malang. I specialize in designing and shipping production-grade web systems, high-concurrency event platforms, and robust database architectures using Next.js, React, Nest.js, and Laravel.\n\nMy engineering philosophy focuses on system reliability, clean modular architectures, type-safety, and intuitive user experiences. Over the past 2 years, I have architected and deployed multiple live production web applications, including digital event check-in systems and multi-tenant platforms.\n\nI continuously explore agentic workflows, WebGL 3D interaction design, and automated DevOps pipelines with Docker and GitHub Actions.',
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
