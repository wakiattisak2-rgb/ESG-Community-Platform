import type { UserProfile } from '@/types'

export const mockPersonas: UserProfile[] = [
  {
    id: 'user-member',
    displayName: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    role: 'member',
    avatarInitials: 'สJ',
  },
  {
    id: 'user-expert',
    displayName: 'Dr. Elena Green',
    email: 'elena@esg.org',
    role: 'expert',
    avatarInitials: 'EG',
  },
  {
    id: 'user-moderator',
    displayName: 'คุณมินท์ ผู้ดูแล',
    email: 'mint@aetros.io',
    role: 'moderator',
    avatarInitials: 'MT',
  },
  {
    id: 'user-admin',
    displayName: 'Admin Aetros',
    email: 'admin@aetros.io',
    role: 'admin',
    avatarInitials: 'AA',
  },
]

export const defaultMember: UserProfile = {
  id: 'user-guest',
  displayName: 'Explorer',
  email: 'guest@aetros.io',
  role: 'member',
  avatarInitials: 'EX',
}
