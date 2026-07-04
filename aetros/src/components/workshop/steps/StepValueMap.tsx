import { Plus } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useWorkshopStore } from '@/workshop/useWorkshopStore'

export function StepValueMap() {
  const {
    pains,
    gains,
    valueMap,
    addProductService,
    updateProductService,
    setPainReliever,
    setGainCreator,
  } = useWorkshopStore()

  return (
    <div className="space-y-4">
      <GlassCard hover={false}>
        <h2 className="font-display text-xl text-pure-white mb-2">Value Proposition / Value Map</h2>
        <p className="text-cosmic-dim text-sm">
          ผูก Products & Services กับ Pain Relievers และ Gain Creators ให้ตรงกับ Customer Profile
        </p>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="font-mono text-xs text-aurora-neon uppercase mb-3">Products & Services</h3>
        {valueMap.productsServices.map((ps, i) => (
          <input
            key={i}
            value={ps}
            onChange={(e) => updateProductService(i, e.target.value)}
            placeholder="เช่น Community Hub, Eco-Avatar Dashboard, Carbon Credit Marketplace"
            className="w-full mb-2 px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
          />
        ))}
        <Button variant="ghost" size="sm" onClick={addProductService}>
          <Plus size={14} /> เพิ่ม Product/Service
        </Button>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="font-mono text-xs text-aurora-neon uppercase mb-3">Pain Relievers</h3>
        {pains.length === 0 ? (
          <p className="text-cosmic-faint text-sm">เพิ่ม Pains ใน Step 4 ก่อน</p>
        ) : (
          pains.map((pain) => {
            const pr = valueMap.painRelievers.find((r) => r.painId === pain.id)
            return (
              <div key={pain.id} className="mb-4">
                <p className="text-sm text-cosmic-smoke mb-1">
                  Pain [{pain.importance}/5]: {pain.text || '—'}
                </p>
                <input
                  value={pr?.description ?? ''}
                  onChange={(e) => setPainReliever(pain.id, e.target.value)}
                  placeholder="ฟีเจอร์/บริการที่ช่วยลด pain นี้..."
                  className="w-full px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
                />
              </div>
            )
          })
        )}
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="font-mono text-xs text-aurora-neon uppercase mb-3">Gain Creators</h3>
        {gains.length === 0 ? (
          <p className="text-cosmic-faint text-sm">เพิ่ม Gains ใน Step 4 ก่อน</p>
        ) : (
          gains.map((gain) => {
            const gc = valueMap.gainCreators.find((c) => c.gainId === gain.id)
            return (
              <div key={gain.id} className="mb-4">
                <p className="text-sm text-cosmic-smoke mb-1">
                  Gain [{gain.importance}/5]: {gain.text || '—'}
                </p>
                <input
                  value={gc?.description ?? ''}
                  onChange={(e) => setGainCreator(gain.id, e.target.value)}
                  placeholder="ฟีเจอร์/บริการที่สร้าง gain นี้..."
                  className="w-full px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
                />
              </div>
            )
          })
        )}
      </GlassCard>
    </div>
  )
}
