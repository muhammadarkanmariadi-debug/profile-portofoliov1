import { getAchievements } from '@/lib/services/achievement.service'
import AchievementsClient from './AchievementsClient'

export const dynamic = 'force-dynamic'

export default async function AchievementsPage() {
  const achievements = await getAchievements()
  
  return (
    <AchievementsClient initialAchievements={achievements} />
  )
}
