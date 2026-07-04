import { Lightbulb } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useWorkshopStore } from '@/workshop/useWorkshopStore'

export function StepWelcome() {
  const { projectName, setProjectName, loadAetrosTemplate } = useWorkshopStore()

  return (
    <div className="space-y-6">
      <GlassCard hover={false}>
        <h2 className="font-display text-2xl text-pure-white mb-3">
          Strategy Workshop — JTBD → VPC → BMC
        </h2>
        <p className="text-cosmic-smoke leading-relaxed mb-4">
          เวิร์กช็อปส่วนตัวนี้ช่วยคุณ &quot;ตกผลึก&quot; โมเดลธุรกิจและ Value Proposition สำหรับ
          Aetros โดยใช้ <strong className="text-aurora-neon">Jobs-to-be-Done</strong> เป็นแกนกลาง
          แล้วแตกไปสู่ Customer Profile, Value Map และ Business Model Canvas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {[
            {
              term: 'JTBD',
              def: 'ลูกค้า "จ้าง" ผลิตภัณฑ์ไปทำงานอะไร — ซื้อความก้าวหน้า ไม่ใช่แค่ฟีเจอร์',
            },
            {
              term: 'Value Proposition',
              def: 'Pain Relievers + Gain Creators ที่ตอบ Jobs, Pains, Gains ของลูกค้า',
            },
            {
              term: 'Product–Market Fit',
              def: 'Problem–Solution Fit → Product–Market Fit → Business Model Fit',
            },
          ].map(({ term, def }) => (
            <div key={term} className="p-3 rounded-lg bg-space-black/50 border border-glass-border">
              <p className="font-mono text-xs text-aurora-neon mb-1">{term}</p>
              <p className="text-cosmic-dim text-sm">{def}</p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-aurora-neon/5 border border-aurora-neon/20 mb-6">
          <Lightbulb size={16} className="text-aurora-neon shrink-0 mt-0.5" />
          <p className="text-sm text-cosmic-smoke">
            <strong>Tip จาก JTBD:</strong> ลูกค้าไม่ได้จ่ายเพื่อซื้อ &quot;แพลตฟอร์ม&quot;
            แต่จ่ายเพื่อความก้าวหน้า — จาก Point A (ไม่มั่นใจ/ทำ ESG ไม่เป็น) ไป Point B
            (มี impact ที่วัดได้ / ส่งรายงานได้)
          </p>
        </div>

        <label className="font-mono text-xs text-cosmic-dim uppercase tracking-wider mb-2 block">
          ชื่อโปรเจกต์ / แบรนด์
        </label>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="เช่น Aetros — ESG Community Platform"
          className="w-full px-4 py-3 rounded-lg bg-space-black border border-glass-border text-cosmic-smoke focus:border-aurora-neon/50 focus:outline-none mb-4"
        />

        <Button variant="outline" size="sm" onClick={loadAetrosTemplate}>
          โหลดตัวอย่าง Aetros (ESG)
        </Button>
      </GlassCard>
    </div>
  )
}
