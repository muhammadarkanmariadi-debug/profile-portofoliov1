import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AchievementForm from '@/app/components/admin/AchievementForm';

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const achievement = await prisma.achievement.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!achievement) {
    notFound();
  }

  return <AchievementForm initialData={achievement} />;
}
