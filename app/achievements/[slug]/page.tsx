import React from 'react'
import { notFound } from 'next/navigation'
import { getAchievementBySlug, getAchievements } from '@/lib/services/achievement.service'
import AchievementDetailClient from './AchievementDetailClient'

export const revalidate = 0;

interface AchievementPageProps {
  params: Promise<{ slug: string }>
}

export default async function AchievementDetailPage(props: AchievementPageProps) {
  const params = await props.params;
  const achievement = await getAchievementBySlug(params.slug);

  if (!achievement) {
    notFound();
  }

  const allAchievements = await getAchievements();
  const currentIndex = allAchievements.findIndex(a => a.id === achievement.id || a.slug === achievement.slug);
  const nextAchievement = allAchievements[(currentIndex + 1) % allAchievements.length];

  return (
    <AchievementDetailClient
      achievement={achievement}
      nextAchievement={nextAchievement}
    />
  );
}

