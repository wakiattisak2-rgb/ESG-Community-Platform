import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StepProgress } from '@/components/workshop/StepProgress'
import { StepWelcome } from '@/components/workshop/steps/StepWelcome'
import { StepSegments } from '@/components/workshop/steps/StepSegments'
import { StepJTBD } from '@/components/workshop/steps/StepJTBD'
import { StepPainsGains } from '@/components/workshop/steps/StepPainsGains'
import { StepValueMap } from '@/components/workshop/steps/StepValueMap'
import { StepFitCheck } from '@/components/workshop/steps/StepFitCheck'
import { StepSummary } from '@/components/workshop/steps/StepSummary'
import { useWorkshopStore } from '@/workshop/useWorkshopStore'
import { WORKSHOP_STEPS } from '@/workshop/types'

const STEPS = [
  StepWelcome,
  StepSegments,
  StepJTBD,
  StepPainsGains,
  StepValueMap,
  StepFitCheck,
  StepSummary,
]

export function WorkshopWizard() {
  const { currentStep, setStep } = useWorkshopStore()

  const StepComponent = STEPS[currentStep] ?? StepWelcome

  return (
    <div>
      <StepProgress current={currentStep} onJump={setStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8 pt-6 border-t border-glass-border">
        <Button
          variant="ghost"
          disabled={currentStep === 0}
          onClick={() => setStep(currentStep - 1)}
        >
          <ChevronLeft size={16} /> ย้อนกลับ
        </Button>
        {currentStep < WORKSHOP_STEPS - 1 ? (
          <Button onClick={() => setStep(currentStep + 1)}>
            ถัดไป <ChevronRight size={16} />
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setStep(0)}>
            เริ่มใหม่จากต้น
          </Button>
        )}
      </div>
    </div>
  )
}
