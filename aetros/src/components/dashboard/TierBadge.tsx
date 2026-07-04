import { useTranslation } from 'react-i18next'
import { getTierInfo } from '@/lib/tiers'

interface TierBadgeProps {
  xp: number
}

export function TierBadge({ xp }: TierBadgeProps) {
  const { t } = useTranslation('dashboard')
  const info = getTierInfo(xp)

  return (
    <div className="glow-aurora inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-space-elevated/80">
      <span className="text-aurora-neon text-sm tier-glow-pulse">{info.icon}</span>
      <span className="font-mono text-xs uppercase tracking-widest text-aurora-neon">
        {t(info.nameKey)}
      </span>
    </div>
  )
}
