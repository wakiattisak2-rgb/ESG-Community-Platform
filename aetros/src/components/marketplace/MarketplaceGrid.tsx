import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { mockProducts } from '@/data/mockProducts'
import { useAppStore } from '@/store/useAppStore'

export function MarketplaceGrid() {
  const { t } = useTranslation('marketplace')
  const { carbonCredits, redeemProduct } = useAppStore()
  const [checkoutProduct, setCheckoutProduct] = useState<(typeof mockProducts)[0] | null>(null)
  const [receipt, setReceipt] = useState<{ name: string; cost: number; at: string } | null>(null)

  const handleRedeem = () => {
    if (!checkoutProduct) return
    const name = t(checkoutProduct.nameKey)
    const success = redeemProduct(checkoutProduct.id, name, checkoutProduct.cost)
    if (success) {
      setReceipt({
        name,
        cost: checkoutProduct.cost,
        at: new Date().toLocaleString(),
      })
    }
    setCheckoutProduct(null)
  }

  return (
    <>
      <GlassCard className="mb-8 text-center">
        <p className="font-mono text-xs text-cosmic-dim uppercase tracking-wider mb-1">
          {t('balance')}
        </p>
        <p className="font-display text-4xl text-aurora-neon neon-text">
          {carbonCredits.toLocaleString()}
        </p>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard className="h-full flex flex-col">
              <div className="text-4xl mb-3">{product.icon}</div>
              <h3 className="font-display text-lg text-pure-white mb-2">
                {t(product.nameKey)}
              </h3>
              <p className="text-cosmic-dim text-sm flex-1 mb-4">
                {t(product.descriptionKey)}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-aurora-neon">{product.cost} CC</span>
                <Button
                  size="sm"
                  variant={carbonCredits >= product.cost ? 'primary' : 'ghost'}
                  disabled={carbonCredits < product.cost}
                  onClick={() => setCheckoutProduct(product)}
                >
                  {carbonCredits >= product.cost ? t('redeem') : t('insufficient')}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={!!checkoutProduct}
        onClose={() => setCheckoutProduct(null)}
        title={t('checkout')}
      >
        {checkoutProduct && (
          <div>
            <p className="text-cosmic-smoke mb-6">
              {t('confirmRedeem', {
                name: t(checkoutProduct.nameKey),
                cost: checkoutProduct.cost,
              })}
            </p>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleRedeem}>
                {t('redeem')}
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setCheckoutProduct(null)}>
                {t('close')}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!receipt} onClose={() => setReceipt(null)} title={t('success')}>
        {receipt && (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-display text-lg text-pure-white mb-2">{t('receipt')}</h3>
            <p className="text-cosmic-smoke mb-1">{receipt.name}</p>
            <p className="font-mono text-aurora-neon mb-1">-{receipt.cost} CC</p>
            <p className="text-cosmic-faint text-xs">{t('redeemedAt')}: {receipt.at}</p>
            <Button className="mt-6 w-full" onClick={() => setReceipt(null)}>
              {t('close')}
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}
