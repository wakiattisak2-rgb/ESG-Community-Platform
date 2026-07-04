import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CommunityFeed } from '@/components/community/CommunityFeed'
import { ChallengeHub } from '@/components/community/ChallengeHub'
import { KnowledgeSidebar } from '@/components/community/KnowledgeSidebar'

type Tab = 'feed' | 'challenges'

export function CommunityPage() {
  const { t } = useTranslation('community')
  const [tab, setTab] = useState<Tab>('feed')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl text-pure-white mb-2">{t('title')}</h1>
        <p className="text-cosmic-dim">{t('subtitle')}</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['feed', 'challenges'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-mono cursor-pointer border transition-all ${
              tab === key
                ? 'bg-aurora-neon/20 text-aurora-neon border-aurora-neon/40'
                : 'bg-transparent text-cosmic-dim border-glass-border hover:text-cosmic-smoke'
            }`}
          >
            {t(key === 'feed' ? 'feed' : 'challengesTab')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <KnowledgeSidebar />
        <div>
          {tab === 'feed' ? <CommunityFeed /> : <ChallengeHub />}
        </div>
      </div>
    </motion.div>
  )
}
