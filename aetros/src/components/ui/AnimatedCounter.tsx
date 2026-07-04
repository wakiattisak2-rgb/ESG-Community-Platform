import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  label?: string
  suffix?: string
  hideLabel?: boolean
  valueClassName?: string
}

export function AnimatedCounter({
  value,
  label = '',
  suffix = '',
  hideLabel = false,
  valueClassName = 'text-pure-white',
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const diff = value - display
    if (diff === 0) return

    const step = Math.ceil(Math.abs(diff) / 10) * Math.sign(diff)
    const timer = setInterval(() => {
      setDisplay((prev) => {
        const next = prev + step
        if ((step > 0 && next >= value) || (step < 0 && next <= value)) {
          clearInterval(timer)
          return value
        }
        return next
      })
    }, 30)
    return () => clearInterval(timer)
  }, [value, display])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className={`font-display text-3xl md:text-4xl tabular-nums ${valueClassName}`}>
        {display.toLocaleString()}
        {suffix}
      </div>
      {!hideLabel && label && (
        <div className="font-mono text-xs text-cosmic-dim uppercase tracking-widest mt-1">
          {label}
        </div>
      )}
    </motion.div>
  )
}
