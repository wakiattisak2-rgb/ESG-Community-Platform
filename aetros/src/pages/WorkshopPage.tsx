import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { Starfield } from '@/components/dashboard/Starfield'
import { WorkshopWizard } from '@/components/workshop/WorkshopWizard'

export function WorkshopPage() {
  return (
    <div className="relative min-h-screen">
      <Starfield />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <Compass className="text-aurora-neon w-8 h-8" />
          <div>
            <p className="font-mono text-xs text-aurora-neon uppercase tracking-widest">
              Aetros Strategy Lab
            </p>
            <h1 className="font-display text-2xl md:text-3xl text-pure-white">
              JTBD → VPC → BMC Workshop
            </h1>
          </div>
        </div>
        <WorkshopWizard />
      </motion.div>
    </div>
  )
}
