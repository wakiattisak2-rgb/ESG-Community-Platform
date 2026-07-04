import { Plus, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useWorkshopStore } from '@/workshop/useWorkshopStore'

const SEGMENT_PRESETS = [
  'เจ้าหน้าที่ ESG / Sustainability Officer',
  'Individual Eco-Enthusiast',
  'ESG Expert / Consultant',
  'Gift Buyer / Corporate CSR Team',
]

export function StepSegments() {
  const { segments, addSegment, updateSegment, removeSegment } = useWorkshopStore()

  return (
    <div className="space-y-4">
      <GlassCard hover={false}>
        <h2 className="font-display text-xl text-pure-white mb-2">Customer Segments & Situations</h2>
        <p className="text-cosmic-dim text-sm mb-4">
          JTBD ไม่แบ่งตามอายุ/ราย income อย่างเดียว — แต่แบ่งตาม <strong>งานที่ต้องทำให้สำเร็จ</strong>
          ใน <strong>สถานการณ์</strong> นั้นๆ
        </p>
        <p className="text-xs text-cosmic-faint font-mono mb-4">
          สรุปเป็น Who + When + Where + Situation ต่อ segment
        </p>
      </GlassCard>

      {segments.map((seg) => (
        <GlassCard key={seg.id} hover={false} className="relative">
          <button
            type="button"
            onClick={() => removeSegment(seg.id)}
            className="absolute top-4 right-4 text-cosmic-faint hover:text-red-400 bg-transparent border-none cursor-pointer"
            aria-label="Remove segment"
          >
            <Trash2 size={16} />
          </button>

          <div className="space-y-3 pr-8">
            <div>
              <label className="text-xs font-mono text-cosmic-dim uppercase">Segment (Who)</label>
              <input
                list="segment-presets"
                value={seg.name}
                onChange={(e) => updateSegment(seg.id, { name: e.target.value })}
                placeholder="เช่น ESG Officer ที่ทำรายงานครั้งแรก"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
              />
              <datalist id="segment-presets">
                {SEGMENT_PRESETS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="text-xs font-mono text-cosmic-dim uppercase">Situation / Context</label>
              <input
                value={seg.situation}
                onChange={(e) => updateSegment(seg.id, { situation: e.target.value })}
                placeholder="เช่น ต้องทำ ESG Report ครั้งแรก ภายใน 3 เดือน"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-cosmic-dim uppercase">When</label>
                <input
                  value={seg.when}
                  onChange={(e) => updateSegment(seg.id, { when: e.target.value })}
                  placeholder="ก่อน quarter close"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-cosmic-dim uppercase">Where</label>
                <input
                  value={seg.where}
                  onChange={(e) => updateSegment(seg.id, { where: e.target.value })}
                  placeholder="องค์กร SME, ทีม ESG 1–3 คน"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </GlassCard>
      ))}

      <Button variant="ghost" onClick={addSegment}>
        <Plus size={16} /> เพิ่ม Segment
      </Button>
    </div>
  )
}
