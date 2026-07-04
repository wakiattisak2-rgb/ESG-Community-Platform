import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  UserProfile,
  ActionLog,
  FeedPost,
  Redemption,
  ImpactStats,
  ImpactTier,
  EsgTopic,
} from '@/types'
import { initialFeedPosts } from '@/data/mockFeed'
import { getActionById, getImpactTier } from '@/data/mockActions'
import { logActionRpc } from '@/lib/dashboardApi'
import { baseImpactStats } from '@/data/impactStats'
import { defaultMember } from '@/data/mockUsers'

interface AppState {
  user: UserProfile | null
  isAuthenticated: boolean
  xp: number
  carbonCredits: number
  loggedActions: ActionLog[]
  joinedChallenges: string[]
  challengeProgress: Record<string, number>
  feedPosts: FeedPost[]
  redemptions: Redemption[]
  impactStats: ImpactStats
  selectedTopic: EsgTopic
  showLoginModal: boolean
  lastEarned: { xp: number; credits: number } | null

  login: (user: UserProfile) => void
  logout: () => void
  setShowLoginModal: (show: boolean) => void
  ensureGuestAccess: () => void
  logAction: (actionTypeId: string, note?: string) => Promise<{ xp: number; credits: number } | null>
  prependActionLog: (log: ActionLog) => void
  syncProfileStats: (xp: number, carbonCredits: number) => void
  joinChallenge: (challengeId: string) => void
  upvotePost: (postId: string) => void
  createPost: (content: string, topic: EsgTopic) => void
  approvePost: (postId: string) => void
  rejectPost: (postId: string) => void
  redeemProduct: (productId: string, productName: string, cost: number) => boolean
  setSelectedTopic: (topic: EsgTopic) => void
  tickImpactStats: () => void
  getImpactTier: () => ImpactTier
  canModerate: () => boolean
  canPostExpert: () => boolean
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: defaultMember,
      isAuthenticated: true,
      xp: 0,
      carbonCredits: 50,
      loggedActions: [],
      joinedChallenges: [],
      challengeProgress: {},
      feedPosts: initialFeedPosts,
      redemptions: [],
      impactStats: baseImpactStats,
      selectedTopic: 'all',
      showLoginModal: false,
      lastEarned: null,

      login: (user) =>
        set({ user, isAuthenticated: true, showLoginModal: false }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          xp: 0,
          carbonCredits: 50,
          loggedActions: [],
          joinedChallenges: [],
          challengeProgress: {},
          redemptions: [],
          lastEarned: null,
        }),

      setShowLoginModal: (show) => set({ showLoginModal: show }),

      ensureGuestAccess: () => {
        const { isAuthenticated, user } = get()
        if (!isAuthenticated || !user) {
          set({ user: defaultMember, isAuthenticated: true, showLoginModal: false })
        }
      },

      logAction: async (actionTypeId, note) => {
        const action = getActionById(actionTypeId)
        if (!action) return null

        const { user } = get()

        const optimisticLog: ActionLog = {
          id: `log-${Date.now()}`,
          actionType: actionTypeId,
          xpEarned: action.xp,
          carbonCredits: action.carbonCredits,
          note,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          xp: state.xp + action.xp,
          carbonCredits: state.carbonCredits + action.carbonCredits,
          loggedActions: [optimisticLog, ...state.loggedActions].slice(0, 20),
          lastEarned: { xp: action.xp, credits: action.carbonCredits },
        }))

        try {
          if (user) {
            const result = await logActionRpc(user.id, actionTypeId, note)
            if (result) {
              set({
                xp: result.xp,
                carbonCredits: result.carbonCredits,
                loggedActions: [
                  result.log,
                  ...get().loggedActions.filter((l) => l.id !== optimisticLog.id),
                ].slice(0, 20),
              })
            }
          }
        } catch {
          // Keep optimistic update on RPC failure in MVP
        }

        return { xp: action.xp, credits: action.carbonCredits }
      },

      prependActionLog: (log) => {
        set((state) => {
          if (state.loggedActions.some((l) => l.id === log.id)) return state
          return {
            loggedActions: [log, ...state.loggedActions].slice(0, 20),
          }
        })
      },

      syncProfileStats: (xp, carbonCredits) => set({ xp, carbonCredits }),

      joinChallenge: (challengeId) => {
        const { joinedChallenges } = get()
        if (joinedChallenges.includes(challengeId)) return
        set({
          joinedChallenges: [...joinedChallenges, challengeId],
          challengeProgress: { ...get().challengeProgress, [challengeId]: 0 },
        })
      },

      upvotePost: (postId) => {
        set((state) => ({
          feedPosts: state.feedPosts.map((p) =>
            p.id === postId && !p.hasUpvoted
              ? { ...p, upvotes: p.upvotes + 1, hasUpvoted: true }
              : p
          ),
        }))
      },

      createPost: (content, topic) => {
        const user = get().user ?? defaultMember

        const isExpert = user.role === 'expert' || user.role === 'admin'
        const post: FeedPost = {
          id: `post-${Date.now()}`,
          authorId: user.id,
          authorName: user.displayName,
          authorRole: user.role,
          content,
          topic,
          status: isExpert && user.role === 'expert' ? 'pending' : 'approved',
          upvotes: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          feedPosts: [post, ...state.feedPosts],
        }))
      },

      approvePost: (postId) => {
        if (!get().canModerate()) return
        set((state) => ({
          feedPosts: state.feedPosts.map((p) =>
            p.id === postId ? { ...p, status: 'approved' as const } : p
          ),
        }))
      },

      rejectPost: (postId) => {
        if (!get().canModerate()) return
        set((state) => ({
          feedPosts: state.feedPosts.map((p) =>
            p.id === postId ? { ...p, status: 'rejected' as const } : p
          ),
        }))
      },

      redeemProduct: (productId, productName, cost) => {
        const { carbonCredits } = get()
        if (carbonCredits < cost) return false

        const redemption: Redemption = {
          id: `red-${Date.now()}`,
          productId,
          productName,
          cost,
          redeemedAt: new Date().toISOString(),
        }

        set((state) => ({
          carbonCredits: state.carbonCredits - cost,
          redemptions: [redemption, ...state.redemptions],
        }))
        return true
      },

      setSelectedTopic: (topic) => set({ selectedTopic: topic }),

      tickImpactStats: () =>
        set((state) => ({
          impactStats: {
            carbonReduced:
              state.impactStats.carbonReduced + Math.floor(Math.random() * 5) + 1,
            treesPlanted:
              state.impactStats.treesPlanted + (Math.random() > 0.7 ? 1 : 0),
            activeInnovators:
              state.impactStats.activeInnovators + (Math.random() > 0.9 ? 1 : 0),
          },
        })),

      getImpactTier: () => getImpactTier(get().xp),

      canModerate: () => {
        const role = get().user?.role
        return role === 'moderator' || role === 'admin'
      },

      canPostExpert: () => {
        const role = get().user?.role
        return role === 'expert' || role === 'moderator' || role === 'admin'
      },
    }),
    {
      name: 'aetros-state',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        xp: state.xp,
        carbonCredits: state.carbonCredits,
        loggedActions: state.loggedActions,
        joinedChallenges: state.joinedChallenges,
        challengeProgress: state.challengeProgress,
        feedPosts: state.feedPosts,
        redemptions: state.redemptions,
      }),
    }
  )
)

export { defaultMember }
