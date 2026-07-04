import type { ImpactStats } from '@/types'

export const baseImpactStats: ImpactStats = {
  carbonReduced: 1284750,
  treesPlanted: 89432,
  activeInnovators: 47281,
}

export function tickImpactStats(stats: ImpactStats): ImpactStats {
  return {
    carbonReduced: stats.carbonReduced + Math.floor(Math.random() * 5) + 1,
    treesPlanted: stats.treesPlanted + (Math.random() > 0.7 ? 1 : 0),
    activeInnovators: stats.activeInnovators + (Math.random() > 0.9 ? 1 : 0),
  }
}
