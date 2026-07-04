import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { EcoAvatar } from '@/components/dashboard/EcoAvatar'
import { ActionTracker } from '@/components/dashboard/ActionTracker'
import { TierBadge } from '@/components/dashboard/TierBadge'
import { Starfield } from '@/components/dashboard/Starfield'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { GlassCard } from '@/components/ui/GlassCard'
import { useAppStore } from '@/store/useAppStore'
import { getTierProgress } from '@/lib/tiers'
import { subscribeActionLogs } from '@/lib/dashboardApi'

const SIMULATE_BOOST = 250

export function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const {
    user,
    xp,
    carbonCredits,
    prependActionLog,
  } = useAppStore()

  const [simulateBoost, setSimulateBoost] = useState(0)
  const displayXp = xp + simulateBoost
  const progress = getTierProgress(displayXp)

  useEffect(() => {
    if (!user?.id) return
    const unsubscribe = subscribeActionLogs(user.id, (log) => {
      prependActionLog(log)
    })
    return () => unsubscribe?.()
  }, [user?.id, prependActionLog])

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-cosmic-dim">{t('signInRequired')}</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <Starfield />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Header card */}
        <GlassCard hover={false} className="mb-8 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <p className="font-mono text-xs text-aurora-neon uppercase tracking-[0.2em] mb-2">
                Inner Universe
              </p>
              <h1 className="font-display text-2xl md:text-3xl text-pure-white mb-4">
                {t('welcomeBack', { name: user.displayName })}
              </h1>
              <TierBadge xp={displayXp} />

              <div className="mt-6 max-w-md">
                <div className="flex justify-between text-xs font-mono text-cosmic-dim mb-2">
                  <span>
                    {progress.current.toLocaleString()} / {progress.next.toLocaleString()} XP
                  </span>
                  {progress.nextNameKey && (
                    <span>{t('xpToTier', { remaining: progress.remaining, tier: t(progress.nextNameKey) })}</span>
                  )}
                </div>
                <div className="h-2.5 rounded-full bg-space-black overflow-hidden border border-glass-border">
                  <div
                    className="h-full rounded-full xp-bar-fill shimmer-bar"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:w-80">
              <GlassCard hover={false} className="p-4 text-center">
                <p className="font-mono text-xs text-cosmic-dim uppercase tracking-wider mb-2">
                  {t('totalXp')}
                </p>
                <AnimatedCounter
                  value={displayXp}
                  hideLabel
                  valueClassName="gradient-stat font-display text-2xl md:text-3xl"
                />
              </GlassCard>
              <GlassCard hover={false} className="p-4 text-center">
                <p className="font-mono text-xs text-cosmic-dim uppercase tracking-wider mb-2">
                  {t('totalCredits')}
                </p>
                <AnimatedCounter
                  value={carbonCredits}
                  hideLabel
                  valueClassName="gradient-stat-aqua font-display text-2xl md:text-3xl"
                />
              </GlassCard>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <GlassCard hover={false}>
            <h2 className="font-display text-xl text-pure-white mb-2">{t('innerUniverse')}</h2>
            <p className="text-cosmic-dim text-sm mb-4">{t('avatarHint')}</p>
            <EcoAvatar
              xp={displayXp}
              simulateBoost={simulateBoost}
              onSimulateLevelUp={() => setSimulateBoost((b) => b + SIMULATE_BOOST)}
              onResetSimulate={() => setSimulateBoost(0)}
            />
          </GlassCard>

          <ActionTracker />
        </div>
      </motion.div>
    </div>
  )
}
