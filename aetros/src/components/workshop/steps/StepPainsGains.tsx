import { Plus, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useWorkshopStore } from '@/workshop/useWorkshopStore'

function RankedList({
  type,
  items,
  segmentId,
  onAdd,
  onUpdate,
  onRemove,
  title,
  hint,
}: {
  type: 'pain' | 'gain'
  items: ReturnType<typeof useWorkshopStore.getState>['pains']
  segmentId: string
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<(typeof items)[0]>) => void
  onRemove: (id: string) => void
  title: string
  hint: string
}) {
  const filtered = items.filter((i) => i.segmentId === segmentId)

  return (
    <div className="mb-4">
      <h4 className="font-mono text-xs text-aurora-neon uppercase mb-1">{title}</h4>
      <p className="text-xs text-cosmic-faint mb-3">{hint}</p>
      {filtered.map((item) => (
        <div key={item.id} className="flex gap-2 mb-2 items-start">
          <select
            value={item.importance}
            onChange={(e) => onUpdate(item.id, { importance: Number(e.target.value) })}
            className="w-14 px-1 py-2 rounded-lg bg-space-black border border-glass-border text-xs focus:outline-none"
            title="ความสำคัญ 1-5"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <select
            value={item.dimension ?? 'functional'}
            onChange={(e) =>
              onUpdate(item.id, { dimension: e.target.value as 'functional' | 'emotional' | 'social' })
            }
            className="w-24 px-1 py-2 rounded-lg bg-space-black border border-glass-border text-xs focus:outline-none"
          >
            <option value="functional">Functional</option>
            <option value="emotional">Emotional</option>
            <option value="social">Social</option>
          </select>
          <input
            value={item.text}
            onChange={(e) => onUpdate(item.id, { text: e.target.value })}
            placeholder={type === 'pain' ? 'Pain / อุปสรรค...' : 'Gain / ผลลัพธ์ที่อยากได้...'}
            className="flex-1 px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-cosmic-faint hover:text-red-400 bg-transparent border-none cursor-pointer p-2"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={onAdd}>
        <Plus size={14} /> เพิ่ม{type === 'pain' ? ' Pain' : ' Gain'}
      </Button>
    </div>
  )
}

export function StepPainsGains() {
  const {
    segments,
    pains,
    gains,
    addPain,
    updatePain,
    removePain,
    addGain,
    updateGain,
    removeGain,
  } = useWorkshopStore()

  if (segments.length === 0) {
    return (
      <GlassCard hover={false}>
        <p className="text-cosmic-dim">กรุณาเพิ่ม Segment ใน Step 2 ก่อน</p>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-4">
      <GlassCard hover={false}>
        <h2 className="font-display text-xl text-pure-white mb-2">Pains & Gains</h2>
        <p className="text-cosmic-dim text-sm">
          <strong>Pains</strong> = ความกลัว, อุปสรรค, frustration เมื่อพยายามทำ Job &nbsp;|&nbsp;
          <strong>Gains</strong> = ผลลัพธ์ดีที่อยากได้ (functional, emotional, social)
        </p>
        <p className="text-xs text-cosmic-faint mt-2">ให้คะแนนความสำคัญ 1–5 เพื่อจัดลำดับ priority</p>
      </GlassCard>

      {segments.map((seg) => (
        <GlassCard key={seg.id} hover={false}>
          <h3 className="font-display text-lg text-pure-white mb-4">{seg.name || 'Segment'}</h3>
          <RankedList
            type="pain"
            items={pains}
            segmentId={seg.id}
            onAdd={() => addPain(seg.id)}
            onUpdate={updatePain}
            onRemove={removePain}
            title="Pains"
            hint="เช่น ข้อมูล ESG กระจาย รวมยาก / ไม่มั่นใจ framework"
          />
          <RankedList
            type="gain"
            items={gains}
            segmentId={seg.id}
            onAdd={() => addGain(seg.id)}
            onUpdate={updateGain}
            onRemove={removeGain}
            title="Gains"
            hint="เช่น ส่งรายงานตรงเวลา / เห็น impact ชัดจาก action เล็กๆ"
          />
        </GlassCard>
      ))}
    </div>
  )
}
