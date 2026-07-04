import type { ActionType } from '@/types'

export const actionTypes: ActionType[] = [
  {
    id: 'ev-transport',
    labelKey: 'actions.evTransport',
    xp: 50,
    carbonCredits: 10,
    icon: '🚇',
    lucideIcon: 'Zap',
  },
  {
    id: 'recycling',
    labelKey: 'actions.recycling',
    xp: 30,
    carbonCredits: 5,
    icon: '♻️',
    lucideIcon: 'Recycle',
  },
  {
    id: 'tree-volunteer',
    labelKey: 'actions.treeVolunteer',
    xp: 100,
    carbonCredits: 20,
    icon: '🌳',
    lucideIcon: 'TreePine',
  },
  {
    id: 'energy-save',
    labelKey: 'actions.energySave',
    xp: 20,
    carbonCredits: 3,
    icon: '💡',
    lucideIcon: 'Lightbulb',
  },
  {
    id: 'water-save',
    labelKey: 'actions.waterSave',
    xp: 15,
    carbonCredits: 3,
    icon: '💧',
    lucideIcon: 'Droplets',
  },
  {
    id: 'plant-based',
    labelKey: 'actions.plantBased',
    xp: 25,
    carbonCredits: 5,
    icon: '🌱',
    lucideIcon: 'Leaf',
  },
  {
    id: 'zero-waste',
    labelKey: 'actions.zeroWaste',
    xp: 40,
    carbonCredits: 8,
    icon: '🚫',
    lucideIcon: 'Trash2',
  },
  {
    id: 'green-commute',
    labelKey: 'actions.greenCommute',
    xp: 35,
    carbonCredits: 7,
    icon: '🚲',
    lucideIcon: 'Bike',
  },
]

export function getActionById(id: string): ActionType | undefined {
  return actionTypes.find((a) => a.id === id)
}

/** Legacy tier helper — marketplace unchanged; dashboard uses lib/tiers.ts */
export function getImpactTier(xp: number): 'Seed' | 'Sprout' | 'Forest' | 'Galaxy' {
  if (xp >= 1500) return 'Galaxy'
  if (xp >= 500) return 'Forest'
  if (xp >= 100) return 'Sprout'
  return 'Seed'
}
