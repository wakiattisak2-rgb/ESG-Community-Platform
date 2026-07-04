import type { Challenge, LeaderboardEntry } from '@/types'

export const mockChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    titleKey: 'challenges.zeroWaste.title',
    descriptionKey: 'challenges.zeroWaste.description',
    durationDays: 7,
    participants: 2847,
    xpReward: 150,
  },
  {
    id: 'challenge-2',
    titleKey: 'challenges.carbonFree.title',
    descriptionKey: 'challenges.carbonFree.description',
    durationDays: 14,
    participants: 1523,
    xpReward: 300,
  },
  {
    id: 'challenge-3',
    titleKey: 'challenges.greenCommute.title',
    descriptionKey: 'challenges.greenCommute.description',
    durationDays: 30,
    participants: 4102,
    xpReward: 500,
  },
]

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Aisha K.', xp: 4820, country: '🇮🇳' },
  { rank: 2, name: 'Carlos M.', xp: 4150, country: '🇧🇷' },
  { rank: 3, name: 'Yuki T.', xp: 3890, country: '🇯🇵' },
  { rank: 4, name: 'สมหญิง ว.', xp: 3420, country: '🇹🇭' },
  { rank: 5, name: 'Emma L.', xp: 3100, country: '🇬🇧' },
]
