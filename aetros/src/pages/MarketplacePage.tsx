import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MarketplaceGrid } from '@/components/marketplace/MarketplaceGrid'

export function MarketplacePage() {
  const { t } = useTranslation('marketplace')

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
      <MarketplaceGrid />
    </motion.div>
  )
}
