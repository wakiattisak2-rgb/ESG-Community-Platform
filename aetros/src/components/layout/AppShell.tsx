import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/store/useAppStore'

const navLinks = [
  { to: '/', key: 'home' },
  { to: '/dashboard', key: 'dashboard' },
  { to: '/community', key: 'community' },
  { to: '/marketplace', key: 'marketplace' },
  { to: '/workshop', key: 'workshop' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('common')
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, carbonCredits } = useAppStore()

  const goTo = (to: string) => {
    navigate(to)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass-card rounded-none border-x-0 border-t-0 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <Sparkles className="text-aurora-neon w-5 h-5" />
              <span className="font-display text-lg text-pure-white">
                Aet<span className="text-aurora-neon">ros</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, key }) => (
                <button
                  key={to}
                  onClick={() => goTo(to)}
                  className={`text-sm bg-transparent border-none cursor-pointer transition-colors ${
                    location.pathname === to
                      ? 'text-aurora-neon'
                      : 'text-cosmic-dim hover:text-cosmic-smoke'
                  }`}
                >
                  {t(`nav.${key}`)}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <LanguageToggle />
              <Badge variant="muted">{carbonCredits} CC</Badge>
              {user && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-aurora-neon/20 border border-aurora-neon/40 flex items-center justify-center text-xs text-aurora-neon font-mono">
                    {user.avatarInitials}
                  </div>
                  <span className="text-xs text-cosmic-dim hidden lg:inline">{user.displayName}</span>
                </div>
              )}
            </div>

            <button
              className="md:hidden text-cosmic-smoke bg-transparent border-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-glass-border overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {navLinks.map(({ to, key }) => (
                  <button
                    key={to}
                    onClick={() => goTo(to)}
                    className="text-left text-cosmic-smoke bg-transparent border-none cursor-pointer py-2"
                  >
                    {t(`nav.${key}`)}
                  </button>
                ))}
                <LanguageToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-glass-border py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-cosmic-dim text-sm mb-1">{t('footer.tagline')}</p>
          <p className="text-cosmic-faint text-xs font-mono">{t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  )
}
