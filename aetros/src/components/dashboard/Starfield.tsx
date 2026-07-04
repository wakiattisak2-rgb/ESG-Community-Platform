import { useEffect, useRef } from 'react'

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let visible = true
    const stars: { x: number; y: number; z: number; s: number }[] = []
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      stars.length = 0
      for (let i = 0; i < 120; i++) {
        stars.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          z: Math.random(),
          s: Math.random() * 1.2 + 0.3,
        })
      }
    }

    const draw = () => {
      if (!visible) return
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      stars.forEach((star) => {
        if (!reducedMotion) star.y += 0.02 + star.z * 0.04
        if (star.y > canvas.offsetHeight) star.y = 0
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(226, 232, 240, ${0.08 + star.z * 0.12})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible && !reducedMotion) raf = requestAnimationFrame(draw)
    }

    resize()
    init()
    if (!reducedMotion) draw()

    window.addEventListener('resize', () => { resize(); init() })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      aria-hidden
    />
  )
}
