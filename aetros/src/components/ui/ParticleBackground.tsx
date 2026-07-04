import { useEffect, useRef } from 'react'

interface DustStar {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  phase: number
  speed: number
}

interface ArmStar {
  angle: number
  radius: number
  size: number
  phase: number
  arm: number
}

interface Constellation {
  arm: number
  offset: number
  stars: { lx: number; ly: number; size: number; phase: number }[]
  vx: number
  vy: number
}

interface FieldStar {
  x: number
  y: number
  size: number
  phase: number
  depth: number
}

function lerpColor(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationId = 0
    let visible = true
    let w = 0
    let h = 0
    let dpr = 1
    let rotation = 0
    let driftX = 0
    let driftY = 0

    const dust: DustStar[] = []
    const armStars: ArmStar[] = []
    const constellations: Constellation[] = []
    const fieldStars: FieldStar[] = []

    const galaxySpan = () => Math.hypot(w, h) * 0.58

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      dust.length = 0
      armStars.length = 0
      constellations.length = 0
      fieldStars.length = 0

      const span = galaxySpan()
      const dustCount = window.innerWidth < 768 ? 180 : 320
      for (let i = 0; i < dustCount; i++) {
        dust.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.06,
          size: Math.random() * 1.4 + 0.25,
          phase: Math.random() * Math.PI * 2,
          speed: 0.012 + Math.random() * 0.022,
        })
      }

      const fieldCount = window.innerWidth < 768 ? 90 : 160
      for (let i = 0; i < fieldCount; i++) {
        fieldStars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.8 + 0.35,
          phase: Math.random() * Math.PI * 2,
          depth: 0.3 + Math.random() * 0.7,
        })
      }

      const armCount = 4
      for (let arm = 0; arm < armCount; arm++) {
        const innerCount = window.innerWidth < 768 ? 55 : 95
        for (let i = 0; i < innerCount; i++) {
          armStars.push({
            arm,
            angle: (i / innerCount) * Math.PI * 4 + arm * ((Math.PI * 2) / armCount),
            radius: 30 + (i / innerCount) * span,
            size: Math.random() * 1.6 + 0.35,
            phase: Math.random() * Math.PI * 2,
          })
        }

        constellations.push({
          arm,
          offset: 0.28 + arm * 0.17,
          stars: Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2
            return {
              lx: Math.cos(a) * (28 + Math.random() * 38),
              ly: Math.sin(a) * (28 + Math.random() * 38),
              size: 1.1 + Math.random() * 2.2,
              phase: Math.random() * Math.PI * 2,
            }
          }),
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
        })
      }
    }

    const core = (time: number, scale: number) => {
      const breathe = Math.sin(time * 0.00025) * spanDrift(time)
      return {
        x: w * 0.5 + driftX + breathe * 0.15,
        y: h * 0.5 + driftY + Math.cos(time * 0.0002) * spanDrift(time) * 0.12,
        scale,
      }
    }

    const spanDrift = (time: number) => Math.min(w, h) * 0.018 * Math.sin(time * 0.00018)

    const armPoint = (star: ArmStar, rot: number, cx: number, cy: number, scale: number) => {
      const a = star.angle + rot + star.arm * 0.12
      const spiral = star.radius * scale * (1 + 0.1 * Math.sin(a * 2.2))
      return {
        x: cx + Math.cos(a) * spiral,
        y: cy + Math.sin(a) * spiral * 0.52,
      }
    }

    const constellationCenter = (c: Constellation, rot: number, cx: number, cy: number, scale: number) => {
      const span = galaxySpan()
      const a = rot + c.arm * (Math.PI / 2) + c.offset * Math.PI * 2
      const r = span * (0.22 + c.offset * 0.38) * scale
      return {
        x: cx + Math.cos(a) * r + c.vx * 60,
        y: cy + Math.sin(a) * r * 0.52 + c.vy * 60,
      }
    }

    const updateConstellations = () => {
      for (let i = 0; i < constellations.length; i++) {
        for (let j = i + 1; j < constellations.length; j++) {
          const ci = constellationCenter(constellations[i], rotation, w * 0.5, h * 0.5, 1)
          const cj = constellationCenter(constellations[j], rotation, w * 0.5, h * 0.5, 1)
          const dx = cj.x - ci.x
          const dy = cj.y - ci.y
          const dist = Math.hypot(dx, dy) || 1
          if (dist < 220) {
            const f = 0.015 * (1 - dist / 220)
            constellations[i].vx -= (dx / dist) * f
            constellations[i].vy -= (dy / dist) * f
            constellations[j].vx += (dx / dist) * f
            constellations[j].vy += (dy / dist) * f
          }
        }
        constellations[i].vx *= 0.992
        constellations[i].vy *= 0.992
      }
    }

    const updateDust = () => {
      dust.forEach((s) => {
        s.x += s.vx
        s.y += s.vy
        if (s.x < -4) s.x = w + 4
        if (s.x > w + 4) s.x = -4
        if (s.y < -4) s.y = h + 4
        if (s.y > h + 4) s.y = -4
      })
    }

    const drawNebula = (time: number, cx: number, cy: number, scale: number) => {
      const span = galaxySpan() * scale

      const nebula = ctx.createRadialGradient(cx, cy, 0, cx, cy, span * 1.05)
      nebula.addColorStop(0, `rgba(0, 255, 102, ${0.05 + 0.025 * Math.sin(time * 0.0008)})`)
      nebula.addColorStop(0.25, 'rgba(0, 229, 255, 0.022)')
      nebula.addColorStop(0.55, 'rgba(0, 255, 102, 0.008)')
      nebula.addColorStop(0.85, 'rgba(11, 15, 25, 0)')
      nebula.addColorStop(1, 'rgba(11, 15, 25, 0)')
      ctx.fillStyle = nebula
      ctx.fillRect(0, 0, w, h)

      const cornerOffsets = [
        { x: w * 0.12, y: h * 0.15 },
        { x: w * 0.88, y: h * 0.2 },
        { x: w * 0.15, y: h * 0.85 },
        { x: w * 0.85, y: h * 0.82 },
      ]
      cornerOffsets.forEach((pos, i) => {
        const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, span * 0.35)
        g.addColorStop(0, `rgba(0, 255, 102, ${0.012 + 0.008 * Math.sin(time * 0.001 + i)})`)
        g.addColorStop(1, 'rgba(11, 15, 25, 0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      })

      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120 * scale)
      coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
      coreGlow.addColorStop(0.2, 'rgba(0, 255, 102, 0.12)')
      coreGlow.addColorStop(0.5, 'rgba(0, 229, 255, 0.04)')
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = coreGlow
      ctx.beginPath()
      ctx.arc(cx, cy, 120 * scale, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawFieldStars = (time: number) => {
      fieldStars.forEach((s) => {
        const tw = 0.15 + 0.85 * Math.abs(Math.sin(time * 0.0018 * s.depth + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * (0.5 + tw * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(226, 232, 240, ${0.06 + tw * 0.22 * s.depth})`
        ctx.fill()
      })
    }

    const drawDust = (time: number) => {
      dust.forEach((s) => {
        const tw = 0.2 + 0.8 * Math.abs(Math.sin(time * s.speed + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(226, 232, 240, ${0.06 + tw * 0.28})`
        ctx.fill()
      })
    }

    const drawArms = (time: number, cx: number, cy: number, scale: number) => {
      const span = galaxySpan()
      armStars.forEach((star) => {
        const { x, y } = armPoint(star, rotation, cx, cy, scale)
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(time * 0.002 + star.phase))
        const t = star.radius / span
        const r = lerpColor(0, 255, 1 - t * 0.45)
        const g = lerpColor(255, 229, t * 0.35)
        const b = lerpColor(102, 255, t * 0.55)

        ctx.beginPath()
        ctx.arc(x, y, star.size * (0.55 + tw * 0.55), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${0.12 + tw * 0.42})`
        ctx.fill()
      })
    }

    const drawConstellations = (time: number, cx: number, cy: number, scale: number) => {
      constellations.forEach((c, ci) => {
        const center = constellationCenter(c, rotation, cx, cy, scale)
        const worldStars = c.stars.map((s) => ({
          ...s,
          x: center.x + s.lx * scale,
          y: center.y + s.ly * scale,
        }))

        worldStars.forEach((a, i) => {
          for (let j = i + 1; j < worldStars.length; j++) {
            const b = worldStars[j]
            const dist = Math.hypot(b.x - a.x, b.y - a.y)
            if (dist < 95) {
              const alpha = (1 - dist / 95) * (0.14 + 0.05 * Math.sin(time * 0.002 + ci))
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(0, 255, 102, ${alpha})`
              ctx.lineWidth = 0.55
              ctx.stroke()
            }
          }
        })

        worldStars.forEach((s) => {
          const tw = 0.35 + 0.65 * Math.abs(Math.sin(time * 0.025 + s.phase))
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * (0.65 + tw * 0.65), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 255, 220, ${0.4 + tw * 0.55})`
          ctx.shadowColor = '#00FF66'
          ctx.shadowBlur = 5 + tw * 12
          ctx.fill()
          ctx.shadowBlur = 0
        })
      })
    }

    const draw = (time: number) => {
      if (!visible) return
      ctx.clearRect(0, 0, w, h)

      const scale = 1 + 0.14 * Math.sin(time * 0.00028) + 0.06 * Math.sin(time * 0.00011)
      rotation += 0.00032
      driftX = Math.sin(time * 0.00015) * w * 0.012
      driftY = Math.cos(time * 0.00012) * h * 0.01

      const { x: cx, y: cy } = core(time, scale)

      updateConstellations()
      updateDust()
      drawNebula(time, cx, cy, scale)
      drawFieldStars(time)
      drawDust(time)
      drawArms(time, cx, cy, scale)
      drawConstellations(time, cx, cy, scale)

      animationId = requestAnimationFrame(draw)
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h)
      const cx = w * 0.5
      const cy = h * 0.5
      drawNebula(0, cx, cy, 1.08)
      drawFieldStars(0)
      drawDust(0)
      drawArms(0, cx, cy, 1.08)
      drawConstellations(0, cx, cy, 1.08)
    }

    const onResize = () => {
      resize()
      init()
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible && !reducedMotion) animationId = requestAnimationFrame(draw)
    }

    resize()
    init()
    if (reducedMotion) drawStatic()
    else animationId = requestAnimationFrame(draw)

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  )
}
