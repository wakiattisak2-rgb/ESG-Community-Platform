import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import type { EsgTopic } from '@/types'

const topics: EsgTopic[] = ['all', 'environment', 'social', 'governance']

export function KnowledgeSidebar() {
  const { t } = useTranslation('community')
  const { t: tc } = useTranslation('common')
  const { selectedTopic, setSelectedTopic } = useAppStore()

  return (
    <aside className="glass-card p-4 h-fit sticky top-20">
      <h3 className="font-display text-sm text-pure-white mb-4">{t('knowledge')}</h3>
      <nav className="space-y-1">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer border-none',
              selectedTopic === topic
                ? 'bg-aurora-neon/15 text-aurora-neon'
                : 'bg-transparent text-cosmic-dim hover:text-cosmic-smoke hover:bg-space-elevated'
            )}
          >
            {tc(`topics.${topic}`)}
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-4 border-t border-glass-border">
        <p className="font-mono text-xs text-cosmic-faint leading-relaxed">
          ESG Report · GRI · Scope 1-3 · CSRD
        </p>
      </div>
    </aside>
  )
}
