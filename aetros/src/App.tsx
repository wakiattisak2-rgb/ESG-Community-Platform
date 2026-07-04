import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CommunityPage } from '@/pages/CommunityPage'
import { MarketplacePage } from '@/pages/MarketplacePage'
import { WorkshopPage } from '@/pages/WorkshopPage'
import { useAppStore } from '@/store/useAppStore'
import { isSupabaseConfigured } from '@/lib/supabase'
import { initSupabaseSession } from '@/lib/supabaseAuth'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/workshop" element={<WorkshopPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  useEffect(() => {
    const boot = async () => {
      if (isSupabaseConfigured()) {
        const session = await initSupabaseSession()
        if (session) {
          const { login, syncProfileStats } = useAppStore.getState()
          login(session.user)
          syncProfileStats(session.xp, session.carbonCredits)
          return
        }
      }
      useAppStore.getState().ensureGuestAccess()
    }
    void boot()
  }, [])

  return (
    <BrowserRouter>
      <AppShell>
        <AnimatedRoutes />
      </AppShell>
    </BrowserRouter>
  )
}

export default App
