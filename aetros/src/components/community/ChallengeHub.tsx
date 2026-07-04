import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { mockChallenges, mockLeaderboard } from '@/data/mockChallenges'
import { useAppStore } from '@/store/useAppStore'

export function ChallengeHub() {
  const { t } = useTranslation('community')
  const { joinedChallenges, joinChallenge, challengeProgress } = useAppStore()

  const handleJoin = (id: string) => {
    joinChallenge(id)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockChallenges.map((challenge, i) => {
          const joined = joinedChallenges.includes(challenge.id)
          const progress = challengeProgress[challenge.id] ?? 0

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col">
                <Badge variant="neon" className="mb-3 self-start">
                  {challenge.durationDays} {t('days')}
                </Badge>
                <h3 className="font-display text-lg text-pure-white mb-2">
                  {t(challenge.titleKey)}
                </h3>
                <p className="text-cosmic-dim text-sm flex-1 mb-4">
                  {t(challenge.descriptionKey)}
                </p>
                <div className="text-cosmic-faint text-xs font-mono mb-3">
                  {challenge.participants.toLocaleString()} {t('participants')} · +{challenge.xpReward} XP
                </div>

                {joined && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-cosmic-dim mb-1">
                      <span>{t('progress')}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-space-black rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-aurora-neon rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(progress, 5)}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  variant={joined ? 'outline' : 'primary'}
                  size="sm"
                  className="w-full"
                  onClick={() => handleJoin(challenge.id)}
                  disabled={joined}
                >
                  {joined ? t('joined') : t('joinChallenge')}
                </Button>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      <GlassCard>
        <h3 className="font-display text-xl text-pure-white mb-4">{t('leaderboard')}</h3>
        <div className="space-y-2">
          {mockLeaderboard.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between py-2 border-b border-glass-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-aurora-neon w-6">#{entry.rank}</span>
                <span className="text-lg">{entry.country}</span>
                <span className="text-pure-white">{entry.name}</span>
              </div>
              <span className="font-mono text-cosmic-dim text-sm">{entry.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
