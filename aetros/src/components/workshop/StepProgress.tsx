import { cn } from '@/lib/utils'
import { STEP_LABELS, WORKSHOP_STEPS } from '@/workshop/types'

const STEP_TITLES: Record<(typeof STEP_LABELS)[number], string> = {
  welcome: 'เริ่มต้น',
  segments: 'Segments',
  jtbd: 'JTBD',
  painsGains: 'Pains & Gains',
  valueMap: 'Value Map',
  fitCheck: 'Fit Check',
  summary: 'สรุป',
}

interface StepProgressProps {
  current: number
  onJump?: (step: number) => void
}

export function StepProgress({ current, onJump }: StepProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
        {STEP_LABELS.map((key, i) => (
          <button
            key={key}
            type="button"
            onClick={() => onJump?.(i)}
            className={cn(
              'flex flex-col items-center min-w-[72px] cursor-pointer bg-transparent border-none p-0',
              i <= current ? 'opacity-100' : 'opacity-40'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border transition-all',
                i === current
                  ? 'bg-aurora-neon/20 border-aurora-neon text-aurora-neon shadow-neon'
                  : i < current
                    ? 'bg-aurora-neon/10 border-aurora-neon/50 text-aurora-neon'
                    : 'border-glass-border text-cosmic-dim'
              )}
            >
              {i + 1}
            </div>
            <span className="text-[10px] text-cosmic-dim mt-1 whitespace-nowrap">
              {STEP_TITLES[key]}
            </span>
          </button>
        ))}
      </div>
      <div className="h-1 bg-space-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-aurora-neon to-[#00E5FF] transition-all duration-500"
          style={{ width: `${((current + 1) / WORKSHOP_STEPS) * 100}%` }}
        />
      </div>
    </div>
  )
}
