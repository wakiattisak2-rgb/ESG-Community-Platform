interface FloatingXpProps {
  xp: number
  credits: number
  position: { x: number; y: number }
  onDone?: () => void
}

export function FloatingXp({ xp, credits, position, onDone }: FloatingXpProps) {
  return (
    <div
      className="fixed pointer-events-none z-50 font-mono text-sm font-semibold particle-rise"
      style={{ left: position.x, top: position.y }}
      onAnimationEnd={onDone}
    >
      <span className="text-aurora-neon block">+{xp} XP</span>
      <span className="text-[#00E5FF] block text-xs">+{credits} CC</span>
    </div>
  )
}
