import { Plus } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useWorkshopStore } from '@/workshop/useWorkshopStore'
import { JTBD_EXAMPLES } from '@/workshop/defaults'
import { jtbdFormatted } from '@/workshop/exportSummary'

export function StepJTBD() {
  const { segments, jtbdStatements, addJtbd, updateJtbd } = useWorkshopStore()

  if (segments.length === 0) {
    return (
      <GlassCard hover={false}>
        <p className="text-cosmic-dim">กรุณาเพิ่ม Customer Segment ใน Step 2 ก่อน</p>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-4">
      <GlassCard hover={false}>
        <h2 className="font-display text-xl text-pure-white mb-2">Jobs-to-Be-Done</h2>
        <p className="text-cosmic-dim text-sm mb-3">
          รูปแบบ: <code className="text-aurora-neon text-xs">When [situation], I want to [job], so I can [outcome]</code>
        </p>
        <div className="space-y-2">
          <p className="text-xs font-mono text-cosmic-faint uppercase">ตัวอย่าง Aetros ESG</p>
          {JTBD_EXAMPLES.map((ex) => (
            <p key={ex.label} className="text-xs text-cosmic-dim pl-3 border-l-2 border-aurora-neon/30">
              <span className="text-aurora-neon">{ex.label}:</span> {ex.text}
            </p>
          ))}
        </div>
      </GlassCard>

      {segments.map((seg) => {
        const jobs = jtbdStatements.filter((j) => j.segmentId === seg.id)
        return (
          <GlassCard key={seg.id} hover={false}>
            <h3 className="font-display text-lg text-pure-white mb-3">{seg.name || 'Segment'}</h3>

            {jobs.map((j) => (
              <div key={j.id} className="space-y-3 mb-6 pb-6 border-b border-glass-border last:border-0">
                <div className="grid grid-cols-1 gap-3">
                  <input
                    value={j.situation}
                    onChange={(e) => updateJtbd(j.id, { situation: e.target.value })}
                    placeholder="When [situation]..."
                    className="px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
                  />
                  <input
                    value={j.job}
                    onChange={(e) => updateJtbd(j.id, { job: e.target.value })}
                    placeholder="I want to [job]..."
                    className="px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
                  />
                  <input
                    value={j.outcome}
                    onChange={(e) => updateJtbd(j.id, { outcome: e.target.value })}
                    placeholder="so I can [desired outcome]..."
                    className="px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
                  />
                </div>

                {(j.situation || j.job || j.outcome) && (
                  <p className="text-xs font-mono text-aurora-neon/80 p-2 bg-space-black rounded">
                    {jtbdFormatted(j)}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['functional', 'emotional', 'social'] as const).map((dim) => (
                    <div key={dim}>
                      <label className="text-xs font-mono text-cosmic-dim uppercase">{dim}</label>
                      <input
                        value={j[dim]}
                        onChange={(e) => updateJtbd(j.id, { [dim]: e.target.value })}
                        placeholder={`${dim} job...`}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-space-black border border-glass-border text-sm focus:border-aurora-neon/50 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button variant="ghost" size="sm" onClick={() => addJtbd(seg.id)}>
              <Plus size={14} /> เพิ่ม JTBD สำหรับ segment นี้
            </Button>
          </GlassCard>
        )
      })}
    </div>
  )
}
