import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectForm from '@/app/components/admin/ProjectForm';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: { techStack: true }
  });

  if (!project) {
    notFound();
  }

  return <ProjectForm initialData={project} />;
}
