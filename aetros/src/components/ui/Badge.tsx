import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'neon' | 'muted' | 'tier'
  className?: string
}

export function Badge({ children, variant = 'neon', className }: BadgeProps) {
  const variants = {
    neon: 'bg-aurora-neon/10 text-aurora-neon border-aurora-neon/30',
    muted: 'bg-space-elevated text-cosmic-dim border-glass-border',
    tier: 'bg-aurora-neon/20 text-aurora-neon border-aurora-neon/50 font-semibold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border font-mono uppercase tracking-wider',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
