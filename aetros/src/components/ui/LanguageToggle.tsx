import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function LanguageToggle({ className }: { className?: string }) {
  const { i18n } = useTranslation()

  const toggle = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className={cn('flex rounded-lg border border-glass-border overflow-hidden', className)}>
      {(['th', 'en'] as const).map((lng) => (
        <button
          key={lng}
          onClick={() => toggle(lng)}
          className={cn(
            'px-3 py-1.5 text-xs font-mono uppercase tracking-wider cursor-pointer border-none transition-all',
            i18n.language === lng
              ? 'bg-aurora-neon/20 text-aurora-neon'
              : 'bg-transparent text-cosmic-dim hover:text-cosmic-smoke'
          )}
        >
          {lng}
        </button>
      ))}
    </div>
  )
}
