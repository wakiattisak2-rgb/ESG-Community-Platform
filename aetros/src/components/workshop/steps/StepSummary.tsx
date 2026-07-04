import { useState } from 'react'
import { Copy, Check, FileText, Table2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useWorkshopStore } from '@/workshop/useWorkshopStore'
import {
  generateMarkdown,
  generateCSV,
  generateInsightText,
} from '@/workshop/exportSummary'

type ExportTab = 'insight' | 'markdown' | 'csv' | 'bmc'

const BMC_LABELS: { key: keyof ReturnType<typeof useWorkshopStore.getState>['bmc']; label: string }[] = [
  { key: 'customerSegments', label: 'Customer Segments' },
  { key: 'valueProposition', label: 'Value Proposition' },
  { key: 'channels', label: 'Channels' },
  { key: 'customerRelationships', label: 'Customer Relationships' },
  { key: 'revenueStreams', label: 'Revenue Streams' },
  { key: 'keyResources', label: 'Key Resources' },
  { key: 'keyActivities', label: 'Key Activities' },
  { key: 'keyPartners', label: 'Key Partners' },
  { key: 'costStructure', label: 'Cost Structure' },
]

export function StepSummary() {
  const state = useWorkshopStore()
  const { updateBmc, autoFillBmcFromWorkshop } = useWorkshopStore()
  const [tab, setTab] = useState<ExportTab>('insight')
  const [copied, setCopied] = useState(false)

  const markdown = generateMarkdown(state)
  const csv = generateCSV(state)
  const insight = generateInsightText(state)

  const copyText =
    tab === 'markdown' ? markdown : tab === 'csv' ? csv : tab === 'insight' ? insight : markdown

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <GlassCard hover={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-display text-xl text-pure-white">
            สรุป — {state.projectName || 'Strategy Workshop'}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={autoFillBmcFromWorkshop}>
              Auto-fill BMC
            </Button>
            <Button size="sm" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(
            [
              { id: 'insight', icon: FileText, label: 'Insight' },
              { id: 'markdown', icon: FileText, label: 'Markdown' },
              { id: 'csv', icon: Table2, label: 'CSV' },
              { id: 'bmc', icon: Table2, label: 'BMC' },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer border transition-all ${
                tab === id
                  ? 'bg-aurora-neon/20 text-aurora-neon border-aurora-neon/40'
                  : 'bg-transparent text-cosmic-dim border-glass-border'
              }`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        {tab === 'insight' && (
          <div className="prose prose-invert max-w-none">
            <p className="text-cosmic-smoke whitespace-pre-line leading-relaxed">{insight}</p>
          </div>
        )}

        {tab === 'markdown' && (
          <pre className="text-xs text-cosmic-smoke bg-space-black p-4 rounded-lg overflow-x-auto max-h-[480px] whitespace-pre-wrap font-mono">
            {markdown}
          </pre>
        )}

        {tab === 'csv' && (
          <pre className="text-xs text-cosmic-smoke bg-space-black p-4 rounded-lg overflow-x-auto max-h-[480px] whitespace-pre font-mono">
            {csv}
          </pre>
        )}

        {tab === 'bmc' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {BMC_LABELS.map(({ key, label }) => (
              <div key={key} className="p-3 rounded-lg bg-space-black/50 border border-glass-border">
                <label className="text-xs font-mono text-aurora-neon uppercase block mb-2">
                  {label}
                </label>
                <textarea
                  value={state.bmc[key]}
                  onChange={(e) => updateBmc({ [key]: e.target.value })}
                  rows={3}
                  className="w-full px-2 py-1.5 rounded bg-space-elevated border border-glass-border text-xs text-cosmic-smoke focus:border-aurora-neon/50 focus:outline-none resize-none"
                />
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <p className="text-xs text-cosmic-faint text-center">
        Export Markdown ไป Obsidian · CSV ไป Google Sheets · ข้อมูลเก็บใน browser (localStorage)
      </p>
    </div>
  )
}
