import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

interface ParticleBurstProps {
  origin: { x: number; y: number } | null
  onComplete?: () => void
}

export function ParticleBurst({ origin, onComplete }: ParticleBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef(0)

  useEffect(() => {
    if (!origin) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    particlesRef.current = Array.from({ length: 24 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 4
      return {
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 900,
        size: 2 + Math.random() * 2,
      }
    })

    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      ctx.clearRect(0, 0, rect.width, rect.height)

      let alive = 0
      particlesRef.current.forEach((p) => {
        p.life = elapsed
        if (p.life > p.maxLife) return
        alive++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05
        const alpha = 1 - p.life / p.maxLife
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 102, ${alpha})`
        ctx.fill()
      })

      if (alive > 0) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [origin, onComplete])

  if (!origin) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden
    />
  )
}
