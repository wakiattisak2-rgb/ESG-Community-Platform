import { GlassCard } from '@/components/ui/GlassCard'
import { useWorkshopStore } from '@/workshop/useWorkshopStore'
import { generateFitFeedback } from '@/workshop/exportSummary'
import type { FitLevel } from '@/workshop/types'

const FIT_OPTIONS: { value: FitLevel; label: string }[] = [
  { value: 'low', label: 'Low — ยังไม่ตอบ' },
  { value: 'medium', label: 'Medium — ตอบบางส่วน' },
  { value: 'high', label: 'High — ตอบชัดเจน' },
]

function FitRow({
  label,
  importance,
  itemId,
  type,
}: {
  label: string
  importance: number
  itemId: string
  type: 'pain' | 'gain'
}) {
  const { fitScores, setFitScore, valueMap } = useWorkshopStore()
  const score = fitScores.find((f) => f.itemId === itemId && f.type === type)
  const mapped =
    type === 'pain'
      ? valueMap.painRelievers.find((pr) => pr.painId === itemId)?.description
      : valueMap.gainCreators.find((gc) => gc.gainId === itemId)?.description

  return (
    <div className="py-3 border-b border-glass-border last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <p className="text-sm text-cosmic-smoke flex-1">
          [{importance}/5] {label || '—'}
        </p>
        <select
          value={score?.coverage ?? 'low'}
          onChange={(e) =>
            setFitScore(itemId, type, e.target.value as FitLevel, mapped ?? '')
          }
          className="px-2 py-1 rounded-lg bg-space-black border border-glass-border text-xs focus:outline-none"
        >
          {FIT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      {mapped && (
        <p className="text-xs text-cosmic-dim pl-2 border-l-2 border-aurora-neon/30">
          → {mapped}
        </p>
      )}
    </div>
  )
}

export function StepFitCheck() {
  const state = useWorkshopStore()
  const feedback = generateFitFeedback(state.pains, state.gains, state.fitScores, state.valueMap)

  return (
    <div className="space-y-4">
      <GlassCard hover={false}>
        <h2 className="font-display text-xl text-pure-white mb-2">Product–Solution / Product–Market Fit</h2>
        <p className="text-cosmic-dim text-sm mb-4">
          ตรวจว่า Pain ↔ Pain Relievers และ Gain ↔ Gain Creators สอดคล้องกันแค่ไหน
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {[
            { level: 'Problem–Solution Fit', desc: 'Value Map ตอบ Pain/Gain หลัก' },
            { level: 'Product–Market Fit', desc: 'ลูกค้าจริงยอมใช้และกลับมา' },
            { level: 'Business Model Fit', desc: 'รายได้ครอบคลุมต้นทุน' },
          ].map(({ level, desc }) => (
            <div key={level} className="p-2 rounded bg-space-black/50 border border-glass-border">
              <p className="text-aurora-neon font-mono">{level}</p>
              <p className="text-cosmic-faint">{desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="font-mono text-xs text-aurora-neon uppercase mb-3">Pain Coverage</h3>
        {state.pains.length === 0 ? (
          <p className="text-cosmic-faint text-sm">ไม่มี Pains</p>
        ) : (
          state.pains.map((p) => (
            <FitRow key={p.id} itemId={p.id} type="pain" label={p.text} importance={p.importance} />
          ))
        )}
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="font-mono text-xs text-aurora-neon uppercase mb-3">Gain Coverage</h3>
        {state.gains.length === 0 ? (
          <p className="text-cosmic-faint text-sm">ไม่มี Gains</p>
        ) : (
          state.gains.map((g) => (
            <FitRow key={g.id} itemId={g.id} type="gain" label={g.text} importance={g.importance} />
          ))
        )}
      </GlassCard>

      <GlassCard hover={false} className="border-aurora-neon/20">
        <h3 className="font-mono text-xs text-aurora-neon uppercase mb-3">Auto Feedback</h3>
        <ul className="space-y-2">
          {feedback.map((f, i) => (
            <li key={i} className="text-sm text-cosmic-smoke">{f}</li>
          ))}
        </ul>
      </GlassCard>
    </div>
  )
}
