import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SkillForm from '@/app/components/admin/SkillForm';

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const skill = await prisma.skill.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!skill) {
    notFound();
  }

  return <SkillForm initialData={skill} />;
}
