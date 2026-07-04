export type FitLevel = 'low' | 'medium' | 'high'

export type JobDimension = 'functional' | 'emotional' | 'social'

export interface Segment {
  id: string
  name: string
  situation: string
  when: string
  where: string
}

export interface JTBDStatement {
  id: string
  segmentId: string
  situation: string
  job: string
  outcome: string
  functional: string
  emotional: string
  social: string
}

export interface RankedItem {
  id: string
  segmentId: string
  text: string
  importance: number
  dimension?: JobDimension
}

export interface PainReliever {
  id: string
  painId: string
  description: string
}

export interface GainCreator {
  id: string
  gainId: string
  description: string
}

export interface FitScore {
  itemId: string
  type: 'pain' | 'gain'
  coverage: FitLevel
  mappedFeature: string
}

export interface ValueMap {
  productsServices: string[]
  painRelievers: PainReliever[]
  gainCreators: GainCreator[]
}

export interface BMCFields {
  customerSegments: string
  valueProposition: string
  channels: string
  customerRelationships: string
  revenueStreams: string
  keyResources: string
  keyActivities: string
  keyPartners: string
  costStructure: string
}

export interface WorkshopState {
  projectName: string
  currentStep: number
  segments: Segment[]
  jtbdStatements: JTBDStatement[]
  pains: RankedItem[]
  gains: RankedItem[]
  valueMap: ValueMap
  fitScores: FitScore[]
  bmc: BMCFields
}

export const WORKSHOP_STEPS = 7

export const STEP_LABELS = [
  'welcome',
  'segments',
  'jtbd',
  'painsGains',
  'valueMap',
  'fitCheck',
  'summary',
] as const
