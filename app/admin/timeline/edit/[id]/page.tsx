import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TimelineForm from '@/app/components/admin/TimelineForm';

export default async function EditTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const entry = await prisma.timelineEntry.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!entry) {
    notFound();
  }

  return <TimelineForm initialData={entry} />;
}
