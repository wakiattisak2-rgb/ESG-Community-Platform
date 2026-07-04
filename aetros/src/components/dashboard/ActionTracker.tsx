import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Zap,
  Recycle,
  TreePine,
  Lightbulb,
  Droplets,
  Leaf,
  Trash2,
  Bike,
  type LucideIcon,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { actionTypes } from '@/data/mockActions'
import { useAppStore } from '@/store/useAppStore'
import { formatRelativeTime } from '@/lib/relativeTime'
import { ParticleBurst } from '@/components/dashboard/ParticleBurst'
import { FloatingXp } from '@/components/dashboard/FloatingXp'

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Recycle,
  TreePine,
  Lightbulb,
  Droplets,
  Leaf,
  Trash2,
  Bike,
}

interface FloatReward {
  id: number
  xp: number
  credits: number
  position: { x: number; y: number }
}

export function ActionTracker() {
  const { t, i18n } = useTranslation('dashboard')
  const { logAction, loggedActions } = useAppStore()
  const [loading, setLoading] = useState<string | null>(null)
  const [burstOrigin, setBurstOrigin] = useState<{ x: number; y: number } | null>(null)
  const [floats, setFloats] = useState<FloatReward[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const handleAction = useCallback(
    async (actionId: string, e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }

      setLoading(actionId)
      setBurstOrigin(origin)

      const result = await logAction(actionId)
      setLoading(null)

      if (result) {
        const floatId = Date.now()
        setFloats((prev) => [
          ...prev,
          { id: floatId, xp: result.xp, credits: result.credits, position: origin },
        ])
        setToast(t('earned', { xp: result.xp, credits: result.credits }))
        setTimeout(() => setToast(null), 2800)
      }
    },
    [logAction, t]
  )

  return (
    <>
      <ParticleBurst origin={burstOrigin} onComplete={() => setBurstOrigin(null)} />
      {floats.map((f) => (
        <FloatingXp
          key={f.id}
          xp={f.xp}
          credits={f.credits}
          position={f.position}
          onDone={() => setFloats((prev) => prev.filter((x) => x.id !== f.id))}
        />
      ))}

      <div className="space-y-6">
        <div>
          <h3 className="font-display text-lg text-pure-white mb-1">{t('actionTracker')}</h3>
          <p className="text-cosmic-faint text-sm mb-4">{t('actionHint')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actionTypes.map((action) => {
              const Icon = iconMap[action.lucideIcon] ?? Zap
              const isLoading = loading === action.id

              return (
                <button
                  key={action.id}
                  type="button"
                  disabled={!!loading}
                  onClick={(e) => handleAction(action.id, e)}
                  className="action-card glass-card glow-hover text-left p-4 cursor-pointer border border-glass-border bg-space-card/60 transition-all duration-250 hover:-translate-y-1 hover:border-aurora-neon/50 hover:shadow-neon disabled:opacity-50"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{action.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={14} className="text-aurora-neon shrink-0" />
                        <span className="text-pure-white text-sm font-medium truncate">
                          {t(action.labelKey)}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-cosmic-dim">
                        +{action.xp} XP · +{action.carbonCredits} CC
                      </div>
                    </div>
                    {isLoading && (
                      <span className="text-aurora-neon text-xs animate-pulse">...</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {toast && (
            <p className="mt-4 text-center text-aurora-neon text-sm font-mono animate-fade-in">
              {toast}
            </p>
          )}
        </div>

        <GlassCard hover={false}>
          <h3 className="font-display text-lg text-pure-white mb-4">{t('recentCosmicActions')}</h3>
          {loggedActions.length === 0 ? (
            <p className="text-cosmic-faint text-sm">{t('noActions')}</p>
          ) : (
            <ul className="space-y-2">
              {loggedActions.slice(0, 8).map((log) => {
                const action = actionTypes.find((a) => a.id === log.actionType)
                const Icon = action ? iconMap[action.lucideIcon] ?? Zap : Zap
                return (
                  <li
                    key={log.id}
                    className="animate-fade-in flex items-center justify-between gap-3 py-2.5 border-b border-glass-border last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg shrink-0">{action?.icon ?? '✦'}</span>
                      <Icon size={14} className="text-aurora-neon/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-cosmic-smoke text-sm truncate">
                          {action ? t(action.labelKey) : log.actionType}
                        </p>
                        <p className="text-cosmic-faint text-xs font-mono">
                          {formatRelativeTime(log.createdAt, i18n.language)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-aurora-neon/10 text-aurora-neon text-xs font-mono">
                        +{log.xpEarned} XP
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-mono">
                        +{log.carbonCredits} CC
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </GlassCard>
      </div>
    </>
  )
}
