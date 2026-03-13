'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Brain, Briefcase, Target, Sparkles, Check } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Step {
  id: string
  label: string
  icon: React.ElementType
  /** ms after start when this step becomes active */
  startsAt: number
  /** progress % when this step starts */
  progressFrom: number
  /** progress % when this step ends (= next step starts) */
  progressTo: number
}

const STEPS_WITH_JOB: Step[] = [
  { id: 'parse',   label: 'Lebenslauf wird eingelesen',       icon: FileText,  startsAt: 0,    progressFrom: 0,  progressTo: 18 },
  { id: 'cv',      label: 'KI analysiert deinen Lebenslauf',  icon: Brain,     startsAt: 900,  progressFrom: 18, progressTo: 52 },
  { id: 'job',     label: 'Job Match wird berechnet',         icon: Briefcase, startsAt: 4500, progressFrom: 52, progressTo: 74 },
  { id: 'fit',     label: 'Passgenauigkeit wird ermittelt',   icon: Target,    startsAt: 7500, progressFrom: 74, progressTo: 90 },
  { id: 'finish',  label: 'Ergebnisse werden aufbereitet',    icon: Sparkles,  startsAt: 10500, progressFrom: 90, progressTo: 96 },
]

const STEPS_WITHOUT_JOB: Step[] = [
  { id: 'parse',   label: 'Lebenslauf wird eingelesen',       icon: FileText,  startsAt: 0,    progressFrom: 0,  progressTo: 20 },
  { id: 'cv',      label: 'KI analysiert deinen Lebenslauf',  icon: Brain,     startsAt: 900,  progressFrom: 20, progressTo: 88 },
  { id: 'finish',  label: 'Ergebnisse werden aufbereitet',    icon: Sparkles,  startsAt: 6000, progressFrom: 88, progressTo: 96 },
]

interface AnalyzingStateProps {
  hasJob?: boolean
}

export default function AnalyzingState({ hasJob = false }: AnalyzingStateProps) {
  const steps = hasJob ? STEPS_WITH_JOB : STEPS_WITHOUT_JOB
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      setElapsed(Date.now() - start)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // Determine current step
  const activeStepIdx = (() => {
    let idx = 0
    for (let i = 0; i < steps.length; i++) {
      if (elapsed >= steps[i].startsAt) idx = i
    }
    return idx
  })()
  const activeStep = steps[activeStepIdx]

  // Interpolate progress within current step
  const progress = (() => {
    const step = steps[activeStepIdx]
    const nextStep = steps[activeStepIdx + 1]
    if (!nextStep) {
      // Last step: ease toward progressTo asymptotically
      const timeInStep = elapsed - step.startsAt
      const range = step.progressTo - step.progressFrom
      const eased = range * (1 - Math.exp(-timeInStep / 4000))
      return Math.min(step.progressFrom + eased, step.progressTo)
    }
    const timeInStep = elapsed - step.startsAt
    const stepDuration = nextStep.startsAt - step.startsAt
    const t = Math.min(timeInStep / stepDuration, 1)
    // ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3)
    return step.progressFrom + (step.progressTo - step.progressFrom) * eased
  })()

  const completedSteps = steps.slice(0, activeStepIdx)

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-6 min-h-[340px] sm:min-h-[440px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="flex flex-col items-center gap-7 w-full max-w-sm"
      >
        {/* Logo */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/Talentblick-logo-loading500x500.gif"
            alt="Talentblick analysiert"
            width={88}
            height={88}
            unoptimized
            className="rounded-2xl"
          />
        </motion.div>

        {/* Current step label */}
        <div className="text-center space-y-1 min-h-[48px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeStep.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="font-syne font-semibold text-base text-foreground"
            >
              {activeStep.label}
            </motion.p>
          </AnimatePresence>
          <p className="text-xs text-muted">
            {Math.round(progress)}% abgeschlossen
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-2">
          <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent-sky"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between px-0.5">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isComplete = i < activeStepIdx
              const isActive = i === activeStepIdx
              return (
                <div key={step.id} className="flex flex-col items-center gap-1">
                  <motion.div
                    animate={
                      isActive
                        ? { scale: [1, 1.15, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 1.6, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
                    className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300',
                      isComplete ? 'bg-status-green text-white' :
                      isActive   ? 'bg-primary text-white shadow-sm shadow-primary/30' :
                                   'bg-surface-3 text-muted'
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isComplete ? (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                          <Check className="w-3 h-3" />
                        </motion.div>
                      ) : (
                        <motion.div key="icon" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Icon className="w-3 h-3" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
