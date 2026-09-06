import React from 'react'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjects } from '@/lib/services/project.service'
import ProjectDetailClient from './ProjectDetailClient'

export const revalidate = 0;

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage(props: ProjectPageProps) {
  const params = await props.params;
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getProjects(10);
  const currentIndex = allProjects.findIndex(p => p.id === project.id || p.slug === project.slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <ProjectDetailClient 
      project={project} 
      nextProject={nextProject} 
    />
  );
}

