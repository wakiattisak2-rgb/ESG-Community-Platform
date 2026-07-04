export type UserRole = 'member' | 'expert' | 'moderator' | 'admin'

export type ImpactTier = 'Seed' | 'Sprout' | 'Forest' | 'Galaxy'

export type PostStatus = 'pending' | 'approved' | 'rejected'

export type EsgTopic = 'environment' | 'social' | 'governance' | 'all'

export interface UserProfile {
  id: string
  displayName: string
  email: string
  role: UserRole
  avatarInitials: string
}

export interface ActionLog {
  id: string
  actionType: string
  xpEarned: number
  carbonCredits: number
  note?: string
  createdAt: string
}

export interface ActionType {
  id: string
  labelKey: string
  xp: number
  carbonCredits: number
  icon: string
  lucideIcon: string
}

export interface FeedPost {
  id: string
  authorId: string
  authorName: string
  authorRole: UserRole
  organization?: string
  content: string
  contentEn?: string
  topic: EsgTopic
  status: PostStatus
  upvotes: number
  comments: number
  hasUpvoted?: boolean
  createdAt: string
}

export interface Challenge {
  id: string
  titleKey: string
  descriptionKey: string
  durationDays: number
  participants: number
  xpReward: number
  progress?: number
}

export interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  country: string
}

export interface MarketplaceProduct {
  id: string
  nameKey: string
  descriptionKey: string
  cost: number
  category: 'badge' | 'certificate' | 'discount'
  icon: string
}

export interface Redemption {
  id: string
  productId: string
  productName: string
  cost: number
  redeemedAt: string
}

export interface ImpactStats {
  carbonReduced: number
  treesPlanted: number
  activeInnovators: number
}
