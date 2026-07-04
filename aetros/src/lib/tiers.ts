export type EcoStage = 'novice' | 'shaper' | 'guardian'

export interface TierInfo {
  stage: EcoStage
  nameKey: string
  icon: string
  minXp: number
  nextThreshold: number | null
  nextNameKey: string | null
}

const TIERS: TierInfo[] = [
  {
    stage: 'novice',
    nameKey: 'tiers.nebulaNovice',
    icon: '✦',
    minXp: 0,
    nextThreshold: 500,
    nextNameKey: 'tiers.stellarShaper',
  },
  {
    stage: 'shaper',
    nameKey: 'tiers.stellarShaper',
    icon: '◈',
    minXp: 500,
    nextThreshold: 1500,
    nextNameKey: 'tiers.galacticGuardian',
  },
  {
    stage: 'guardian',
    nameKey: 'tiers.galacticGuardian',
    icon: '◎',
    minXp: 1500,
    nextThreshold: null,
    nextNameKey: null,
  },
]

export function tierFor(xp: number): EcoStage {
  if (xp >= 1500) return 'guardian'
  if (xp >= 500) return 'shaper'
  return 'novice'
}

export function getTierInfo(xp: number): TierInfo {
  const stage = tierFor(xp)
  return TIERS.find((t) => t.stage === stage) ?? TIERS[0]
}

export function getTierProgress(xp: number): {
  current: number
  next: number
  remaining: number
  percent: number
  nextNameKey: string | null
} {
  const info = getTierInfo(xp)
  if (info.nextThreshold === null) {
    return { current: xp, next: xp, remaining: 0, percent: 100, nextNameKey: null }
  }
  const floor = info.minXp
  const ceiling = info.nextThreshold
  const current = xp - floor
  const span = ceiling - floor
  return {
    current: xp,
    next: ceiling,
    remaining: ceiling - xp,
    percent: Math.min(100, Math.max(0, (current / span) * 100)),
    nextNameKey: info.nextNameKey,
  }
}
