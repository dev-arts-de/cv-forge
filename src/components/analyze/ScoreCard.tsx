'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Progress } from '@/components/ui/progress'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { StatusColor } from '@/types'

// Legacy type kept here since CriterionResult was removed from types/index.ts
interface CriterionResult {
  score: number
  status: StatusColor
  feedback: string
  suggestions: string[]
}
import { cn } from '@/lib/utils'

interface ScoreCardProps {
  title: string
  criterion: CriterionResult
  delay?: number
}

const STATUS_STYLES: Record<StatusColor, { bar: string; badge: string; text: string; border: string }> = {
  green: {
    bar: 'bg-status-green',
    badge: 'bg-status-green/15 text-status-green border border-status-green/25',
    text: 'text-status-green',
    border: 'border-status-green/20',
  },
  yellow: {
    bar: 'bg-status-yellow',
    badge: 'bg-status-yellow/15 text-status-yellow border border-status-yellow/25',
    text: 'text-status-yellow',
    border: 'border-status-yellow/20',
  },
  red: {
    bar: 'bg-status-red',
    badge: 'bg-status-red/15 text-status-red border border-status-red/25',
    text: 'text-status-red',
    border: 'border-status-red/20',
  },
}

function AnimatedScore({ target, color }: { target: number; color: string }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 1000
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref} className={cn('font-syne font-bold text-xl tabular-nums', color)}>
      {current}
    </span>
  )
}

export default function ScoreCard({ title, criterion, delay = 0 }: ScoreCardProps) {
  const t = useTranslations('analyze')
  const [expanded, setExpanded] = useState(false)
  const styles = STATUS_STYLES[criterion.status]
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [progressValue, setProgressValue] = useState(0)

  const statusLabel = {
    green: t('score_good'),
    yellow: t('score_fair'),
    red: t('score_needs_work'),
  }[criterion.status]

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setProgressValue(criterion.score)
      }, delay * 1000 + 200)
      return () => clearTimeout(timer)
    }
  }, [isInView, criterion.score, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'rounded-xl border bg-surface-2 overflow-hidden transition-colors duration-300 hover:bg-surface-3',
        styles.border
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-syne font-semibold text-foreground/90 text-sm leading-tight">{title}</h3>
          <span className={cn('text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 font-medium', styles.badge)}>
            {statusLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <AnimatedScore target={criterion.score} color={styles.text} />
          <span className="text-foreground/30 font-mono text-xs">/100</span>
        </div>

        {/* Progress bar */}
        <Progress
          value={progressValue}
          className="h-1 mb-3"
          indicatorClassName={styles.bar}
        />

        {/* Feedback */}
        <p className="text-xs text-foreground/55 leading-relaxed">{criterion.feedback}</p>

        {/* Suggestions toggle */}
        {criterion.suggestions.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 flex items-center gap-1 text-xs text-cyan-electric/80 hover:text-cyan-electric transition-colors duration-200"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  {t('suggestions_hide')}
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  {criterion.suggestions.length} {t('suggestions_show').split('|')[criterion.suggestions.length === 1 ? 0 : 1].trim()}
                </>
              )}
            </button>

            {expanded && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 space-y-1.5"
              >
                {criterion.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/55">
                    <span className="text-cyan-electric mt-0.5 flex-shrink-0">→</span>
                    {suggestion}
                  </li>
                ))}
              </motion.ul>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
