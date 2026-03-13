'use client'

import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Sparkles, Trophy, Layout, Type, Briefcase, GraduationCap,
  Zap, User, Bot, Check, AlertTriangle, X, ChevronDown, ChevronUp,
} from 'lucide-react'
import type { CVAnalysisResult, AnalysisCategory, CheckItem, StatusColor } from '@/types'
import { CATEGORY_KEYS, type CategoryKey } from '@/types'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface ResultsGridProps {
  result: CVAnalysisResult
}

const CATEGORY_ICONS: Record<CategoryKey, React.ElementType> = {
  grundstruktur: Layout,
  sprache: Type,
  berufserfahrung: Briefcase,
  ausbildung: GraduationCap,
  skills: Zap,
  kontakt: User,
  ats: Bot,
  gesamtwirkung: Sparkles,
}

const STATUS_STYLES: Record<StatusColor, { border: string; badge: string; text: string; bg: string; barFrom: string; barTo: string }> = {
  green: {
    border: 'border-status-green/20',
    badge: 'bg-status-green-light text-status-green border border-status-green/25',
    text: 'text-status-green',
    bg: 'bg-status-green-light',
    barFrom: 'from-status-green',
    barTo: 'to-emerald-400',
  },
  yellow: {
    border: 'border-status-yellow/20',
    badge: 'bg-status-yellow-light text-status-yellow border border-status-yellow/25',
    text: 'text-status-yellow',
    bg: 'bg-status-yellow-light',
    barFrom: 'from-status-yellow',
    barTo: 'to-amber-400',
  },
  red: {
    border: 'border-status-red/20',
    badge: 'bg-status-red-light text-status-red border border-status-red/25',
    text: 'text-status-red',
    bg: 'bg-status-red-light',
    barFrom: 'from-status-red',
    barTo: 'to-rose-400',
  },
}

function CheckIcon({ status }: { status: CheckItem['status'] }) {
  if (status === 'pass') return (
    <motion.div whileHover={{ scale: 1.2 }} className="flex-shrink-0 mt-0.5">
      <Check className="w-3.5 h-3.5 text-status-green" />
    </motion.div>
  )
  if (status === 'warn') return (
    <motion.div whileHover={{ scale: 1.2 }} className="flex-shrink-0 mt-0.5">
      <AlertTriangle className="w-3.5 h-3.5 text-status-yellow" />
    </motion.div>
  )
  return (
    <motion.div whileHover={{ scale: 1.2 }} className="flex-shrink-0 mt-0.5">
      <X className="w-3.5 h-3.5 text-status-red" />
    </motion.div>
  )
}

function AnimatedBar({ value, status, delay = 0 }: { value: number; status: StatusColor; delay?: number }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const styles = STATUS_STYLES[status]

  useEffect(() => {
    if (!isInView) return
    const t = setTimeout(() => setWidth(value), delay * 1000 + 100)
    return () => clearTimeout(t)
  }, [isInView, value, delay])

  return (
    <div ref={ref} className="h-1.5 rounded-full bg-border overflow-hidden">
      <div
        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out', styles.barFrom, styles.barTo)}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

function AnimatedScore({ target, colorClass }: { target: number; colorClass: string }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 900
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
    <span ref={ref} className={cn('font-mono font-bold text-sm tabular-nums', colorClass)}>
      {current}
    </span>
  )
}

interface CategoryCardProps {
  categoryKey: CategoryKey
  category: AnalysisCategory
  delay: number
}

function CategoryCard({ categoryKey, category, delay }: CategoryCardProps) {
  const t = useTranslations('categories')
  const [expanded, setExpanded] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const styles = STATUS_STYLES[category.status]
  const Icon = CATEGORY_ICONS[categoryKey]

  const PREVIEW_COUNT = 2
  const visibleChecks = expanded ? category.checks : category.checks.slice(0, PREVIEW_COUNT)
  const hiddenCount = category.checks.length - PREVIEW_COUNT

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay }}
      whileHover={{ y: -2 }}
      className={cn(
        'rounded-2xl border bg-white overflow-hidden transition-shadow duration-200 hover:shadow-md',
        styles.border
      )}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className={cn('flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center', styles.bg)}
            >
              <Icon className={cn('w-3.5 h-3.5', styles.text)} />
            </motion.div>
            <h3 className="font-syne font-semibold text-foreground text-sm leading-tight truncate">
              {t(categoryKey as Parameters<typeof t>[0])}
            </h3>
          </div>
          <div className={cn('text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-mono font-bold tabular-nums flex items-center gap-0.5', styles.badge)}>
            <AnimatedScore target={category.score} colorClass="" />
            <span className="text-[10px] opacity-60">/100</span>
          </div>
        </div>

        {/* Progress bar */}
        <AnimatedBar value={category.score} status={category.status} delay={delay} />

        {/* Feedback */}
        <p className="text-xs text-muted leading-relaxed mt-2.5 mb-3">{category.feedback}</p>

        {/* Checklist */}
        <ul className="space-y-1">
          {visibleChecks.map((check, i) => (
            <motion.li
              key={check.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + i * 0.05 }}
              className="flex items-start gap-2 py-0.5"
            >
              <CheckIcon status={check.status} />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-foreground/80 font-medium leading-tight">{check.label}</span>
                {check.note && (
                  <span className="text-xs text-muted ml-1.5 leading-tight">— {check.note}</span>
                )}
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Toggle */}
        {hiddenCount > 0 && (
          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="mt-2.5 flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors duration-200 font-medium"
          >
            {expanded ? (
              <><ChevronUp className="w-3 h-3" />{t('checks_hide' as Parameters<typeof t>[0])}</>
            ) : (
              <><ChevronDown className="w-3 h-3" />{t('checks_show' as Parameters<typeof t>[0])}</>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

function OverallScoreCircle({ score, grade }: { score: number; grade: string }) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const duration = 1400
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setAnimated(Math.round(eased * score))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [score])

  const getColor = (s: number) => {
    if (s >= 50) return '#16A34A'
    if (s >= 30) return '#D97706'
    return '#DC2626'
  }
  const getBg = (s: number) => {
    if (s >= 50) return '#DCFCE7'
    if (s >= 30) return '#FEF3C7'
    return '#FEE2E2'
  }

  const color = getColor(score)
  const circumference = 2 * Math.PI * 52
  const dashoffset = circumference - (animated / 100) * circumference

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
      className="relative w-36 h-36"
    >
      <svg className="-rotate-90 w-full h-full" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="#E8EAFD" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="52"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{ transition: 'stroke-dashoffset 0.03s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-black text-4xl tabular-nums" style={{ color }}>
          {animated}
        </span>
        <span
          className="font-syne font-bold text-sm -mt-0.5 px-2 py-0.5 rounded-lg"
          style={{ color, background: getBg(score) }}
        >
          {grade}
        </span>
      </div>
    </motion.div>
  )
}

export default function ResultsGrid({ result }: ResultsGridProps) {
  const t = useTranslations('analyze')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-5"
    >
      {/* LEFT: Score + Quick Wins */}
      <div className="lg:col-span-2 space-y-4">
        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border bg-white p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Trophy className="w-4 h-4 text-accent-yellow" />
            </motion.div>
            <h2 className="font-syne font-semibold text-foreground text-sm">{t('overall_score')}</h2>
          </div>
          <div className="flex justify-center">
            <OverallScoreCircle score={result.overall_score} grade={result.grade} />
          </div>
        </motion.div>

        {/* Quick Wins */}
        {result.top_quick_wins && result.top_quick_wins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl border border-accent-teal/20 bg-accent-teal-light/30 p-4 sm:p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              >
                <Sparkles className="w-4 h-4 text-accent-teal" />
              </motion.div>
              <h3 className="font-syne font-semibold text-foreground text-sm">{t('quick_wins')}</h3>
            </div>
            <ul className="space-y-3">
              {result.top_quick_wins.map((win, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300 }}
                  className="flex items-start gap-3"
                >
                  <motion.span
                    whileHover={{ scale: 1.2 }}
                    className="font-mono text-accent-teal font-bold text-xs flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-accent-teal/15 flex items-center justify-center"
                  >
                    {i + 1}
                  </motion.span>
                  <span className="text-xs text-foreground/75 leading-relaxed">{win}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* RIGHT: Category Cards */}
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-semibold text-foreground text-sm">{t('results_title')}</h2>
          <span className="text-xs text-muted hidden sm:inline">
            Tippe auf eine Kategorie für Details
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORY_KEYS.map((key, i) => {
            const category = result.categories[key]
            if (!category) return null
            return (
              <CategoryCard
                key={key}
                categoryKey={key}
                category={category}
                delay={i * 0.06}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
