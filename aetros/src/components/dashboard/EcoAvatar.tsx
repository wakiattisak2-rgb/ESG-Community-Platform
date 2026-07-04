import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { tierFor, type EcoStage } from '@/lib/tiers'
import { Button } from '@/components/ui/Button'

interface EcoAvatarProps {
  xp: number
  simulateBoost?: number
  onSimulateLevelUp?: () => void
  onResetSimulate?: () => void
}

const NEON = '#00FF66'
const AQUA = '#00E5FF'
const CORE = '#0B0F19'

function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
  const [r1, g1, b1] = parse(a)
  const [r2, g2, b2] = parse(b)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const bl = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r},${g},${bl})`
}

function drawNovice(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  alpha: number
) {
  const cx = w / 2
  const cy = h / 2
  const pulse = 0.85 + Math.sin(t * 0.002) * 0.15

  ctx.globalAlpha = alpha * 0.25
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60 * pulse)
  grad.addColorStop(0, NEON)
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, 60 * pulse, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalAlpha = alpha
  ctx.fillStyle = CORE
  ctx.beginPath()
  ctx.arc(cx, cy, 18, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = NEON
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, 18, 0, Math.PI * 2)
  ctx.stroke()

  const angle = t * 0.0015
  const px = cx + Math.cos(angle) * 42
  const py = cy + Math.sin(angle) * 42
  ctx.fillStyle = NEON
  ctx.shadowColor = NEON
  ctx.shadowBlur = 12
  ctx.beginPath()
  ctx.arc(px, py, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  for (let i = 0; i < 6; i++) {
    const da = (i / 6) * Math.PI * 2 + t * 0.0003
    ctx.globalAlpha = alpha * 0.3
    ctx.fillStyle = NEON
    ctx.beginPath()
    ctx.arc(cx + Math.cos(da) * 55, cy + Math.sin(da) * 55, 1, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawShaper(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  alpha: number
) {
  const cx = w / 2
  const cy = h / 2
  const rings = [35, 55, 75]

  rings.forEach((r, ri) => {
    ctx.globalAlpha = alpha * (0.2 + ri * 0.1)
    ctx.strokeStyle = NEON
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  })

  const dotCount = 10
  const dots: { x: number; y: number }[] = []
  for (let i = 0; i < dotCount; i++) {
    const ring = rings[i % 3]
    const speed = (i % 2 === 0 ? 1 : -1) * (0.0008 + i * 0.0002)
    const angle = t * speed + (i / dotCount) * Math.PI * 2
    const x = cx + Math.cos(angle) * ring
    const y = cy + Math.sin(angle) * ring
    dots.push({ x, y })

    ctx.globalAlpha = alpha * (0.6 + Math.sin(t * 0.003 + i) * 0.4)
    ctx.fillStyle = i % 2 === 0 ? NEON : AQUA
    ctx.shadowColor = ctx.fillStyle as string
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  ctx.globalAlpha = alpha * 0.15
  ctx.strokeStyle = AQUA
  ctx.lineWidth = 0.5
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const twinkle = Math.sin(t * 0.004 + i + j)
      if (twinkle > 0.85) {
        ctx.beginPath()
        ctx.moveTo(dots[i].x, dots[i].y)
        ctx.lineTo(dots[j].x, dots[j].y)
        ctx.stroke()
      }
    }
  }

  ctx.globalAlpha = alpha
  ctx.fillStyle = CORE
  ctx.beginPath()
  ctx.arc(cx, cy, 14, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = NEON
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawGuardian(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  alpha: number
) {
  const cx = w / 2
  const cy = h / 2
  const rot = t * 0.0002

  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30)
  coreGrad.addColorStop(0, '#FFFFFF')
  coreGrad.addColorStop(0.3, NEON)
  coreGrad.addColorStop(1, 'transparent')
  ctx.globalAlpha = alpha * 0.9
  ctx.fillStyle = coreGrad
  ctx.beginPath()
  ctx.arc(cx, cy, 30, 0, Math.PI * 2)
  ctx.fill()

  const particleCount = 400
  for (let i = 0; i < particleCount; i++) {
    const arm = i % 2
    const frac = i / particleCount
    const spiralAngle = frac * Math.PI * 4 + rot + arm * Math.PI
    const radius = 8 + frac * 90
    const x = cx + Math.cos(spiralAngle) * radius
    const y = cy + Math.sin(spiralAngle) * radius * 0.6
    const color = lerpColor(NEON, AQUA, frac)
    ctx.globalAlpha = alpha * (0.3 + frac * 0.5)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, 0.8 + frac * 1.2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

const drawFns: Record<
  EcoStage,
  (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, alpha: number) => void
> = {
  novice: drawNovice,
  shaper: drawShaper,
  guardian: drawGuardian,
}

export function EcoAvatar({
  xp,
  simulateBoost = 0,
  onSimulateLevelUp,
  onResetSimulate,
}: EcoAvatarProps) {
  const { t } = useTranslation('dashboard')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<EcoStage>(tierFor(xp))
  const fadeRef = useRef(1)
  const fadingRef = useRef(false)
  const pendingStageRef = useRef<EcoStage | null>(null)
  const [displayStage, setDisplayStage] = useState<EcoStage>(tierFor(xp))

  useEffect(() => {
    const newStage = tierFor(xp)
    if (newStage !== stageRef.current && !fadingRef.current) {
      fadingRef.current = true
      pendingStageRef.current = newStage
    }
  }, [xp])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let visible = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number) => {
      if (!visible) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      if (fadingRef.current && pendingStageRef.current) {
        fadeRef.current -= reducedMotion ? 1 : 0.08
        if (fadeRef.current <= 0) {
          stageRef.current = pendingStageRef.current
          setDisplayStage(pendingStageRef.current)
          pendingStageRef.current = null
          fadeRef.current = 0
        }
        if (fadeRef.current <= 0 && !pendingStageRef.current) {
          fadeRef.current = reducedMotion ? 1 : 0
          fadingRef.current = false
        }
      } else if (fadeRef.current < 1) {
        fadeRef.current = Math.min(1, fadeRef.current + (reducedMotion ? 1 : 0.08))
      }

      const alpha = fadeRef.current
      drawFns[stageRef.current](ctx, w, h, reducedMotion ? 0 : now, alpha)

      if (!reducedMotion) raf = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible) raf = requestAnimationFrame(draw)
    }

    resize()
    if (reducedMotion) {
      drawFns[stageRef.current](ctx, canvas.offsetWidth, canvas.offsetHeight, 0, 1)
    } else {
      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [displayStage])

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="w-full max-w-[320px] aspect-square"
        aria-label={t('innerUniverse')}
      />
      <p className="font-mono text-sm text-cosmic-dim mt-2">
        {xp.toLocaleString()} XP
        {simulateBoost > 0 && (
          <span className="text-aurora-neon ml-2">(+{simulateBoost} preview)</span>
        )}
      </p>
      {(onSimulateLevelUp || onResetSimulate) && (
        <div className="flex gap-2 mt-3">
          {onSimulateLevelUp && (
            <Button variant="outline" size="sm" onClick={onSimulateLevelUp}>
              {t('simulateLevelUp')}
            </Button>
          )}
          {simulateBoost > 0 && onResetSimulate && (
            <Button variant="ghost" size="sm" onClick={onResetSimulate}>
              {t('resetSimulate')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { tierFor }
