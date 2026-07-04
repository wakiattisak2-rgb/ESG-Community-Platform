import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  LayoutDashboard,
  Users,
  ShoppingBag,
  BookOpen,
  Compass,
  Leaf,
  TreePine,
  Sparkles,
} from 'lucide-react'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Button } from '@/components/ui/Button'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { GlassCard } from '@/components/ui/GlassCard'
import { useAppStore } from '@/store/useAppStore'
import { useEffect } from 'react'

export function HeroSection() {
  const { t } = useTranslation('landing')
  const navigate = useNavigate()
  const handleLaunch = () => navigate('/dashboard')

  const scrollToStory = () => {
    document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden text-center">
      <ParticleBackground />

      <div className="hero-ambient-glow pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-space-black/20 via-transparent to-space-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0B0F19_96%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <span className="hero-badge mb-8">
            <span className="text-aurora-neon">#</span> {t('hero.badge')}
          </span>

          <h1 className="hero-headline font-display text-pure-white mb-6 max-w-4xl">
            {t('hero.headlineBefore')}{' '}
            <span className="hero-within">{t('hero.headlineHighlight')}</span>
            {t('hero.headlineAfter') ? ` ${t('hero.headlineAfter')}` : ''}
          </h1>

          <p className="hero-tagline font-display text-cosmic-dim mb-12 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleLaunch}
              className="hero-cta-primary px-8 py-3.5 text-base font-semibold rounded-full"
            >
              {t('hero.cta')} <ArrowRight size={18} />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={scrollToStory}
              className="hero-cta-ghost px-8 py-3.5 text-base rounded-full border border-white/20 hover:border-aurora-neon/40"
            >
              {t('hero.ctaSecondary')}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const statIcons = [Leaf, TreePine, Sparkles] as const

export function ImpactCounters() {
  const { t } = useTranslation('landing')
  const { impactStats, tickImpactStats } = useAppStore()

  useEffect(() => {
    const interval = setInterval(tickImpactStats, 3000)
    return () => clearInterval(interval)
  }, [tickImpactStats])

  const stats = [
    { value: impactStats.carbonReduced, label: t('stats.carbonReduced'), suffix: '', icon: statIcons[0] },
    { value: impactStats.treesPlanted, label: t('stats.treesPlanted'), suffix: '', icon: statIcons[1] },
    { value: impactStats.activeInnovators, label: t('stats.activeInnovators'), suffix: '', icon: statIcons[2] },
  ]

  return (
    <section className="relative border-y border-glass-border bg-space-black/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {stats.map(({ value, label, suffix, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <Icon className="w-5 h-5 text-aurora-neon mb-3 opacity-90" strokeWidth={1.75} />
              <div className="font-display text-3xl md:text-4xl text-pure-white tabular-nums mb-2 tracking-tight">
                <AnimatedCounter value={value} hideLabel suffix={suffix} valueClassName="text-pure-white font-display text-3xl md:text-4xl" />
              </div>
              <p className="font-mono text-[0.65rem] md:text-xs text-cosmic-dim uppercase tracking-[0.18em]">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BrandStory() {
  const { t } = useTranslation('landing')
  const paragraphs = ['p1', 'p2', 'p3', 'p4', 'p5'] as const

  return (
    <section id="brand-story" className="py-24 md:py-28">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl text-pure-white mb-4 tracking-tight"
        >
          {t('story.title')}
        </motion.h2>
        <p className="text-cosmic-dim mb-12 max-w-xl mx-auto">{t('story.subtitle')}</p>
        <div className="space-y-8 text-left">
          {paragraphs.map((key, i) => (
            <motion.p
              key={key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-cosmic-smoke leading-relaxed text-lg md:text-xl"
            >
              {t(`story.${key}`)}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BentoGrid() {
  const { t } = useTranslation('landing')
  const navigate = useNavigate()

  const items = [
    { key: 'dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { key: 'community', icon: Users, to: '/community' },
    { key: 'marketplace', icon: ShoppingBag, to: '/marketplace' },
    { key: 'knowledge', icon: BookOpen, to: '/community' },
    { key: 'workshop', icon: Compass, to: '/workshop' },
  ] as const

  return (
    <section className="py-24 md:py-28 bg-space-elevated/20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-pure-white mb-3 tracking-tight">
          {t('bento.title')}
        </h2>
        <p className="text-cosmic-dim mb-14 max-w-2xl mx-auto">{t('bento.subtitle')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-left">
          {items.map(({ key, icon: Icon, to }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="h-full p-6" onClick={() => navigate(to)}>
                <Icon className="text-aurora-neon w-7 h-7 mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-base text-pure-white mb-2">
                  {t(`bento.${key}.title`)}
                </h3>
                <p className="text-cosmic-dim text-sm leading-relaxed">{t(`bento.${key}.desc`)}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
