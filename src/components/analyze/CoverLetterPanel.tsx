'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  Layout, Target, Heart, Award, Cpu, Building2, Type,
  TrendingUp, MessageSquare, Check, AlertTriangle, X,
  ChevronDown, ChevronUp, ArrowRight, Bot, User,
} from 'lucide-react'
import type { CoverLetterResult, AnalysisCategory, CoverLetterCategoryKey, CheckItem, StatusColor } from '@/types'
import { COVER_LETTER_CATEGORY_KEYS } from '@/types'
import { cn } from '@/lib/utils'

const CATEGORY_ICONS: Record<CoverLetterCategoryKey, React.ElementType> = {
  grundstruktur: Layout,
  stellenbezug: Target,
  motivation: Heart,
  qualifikationen: Award,
  kompetenzen: Cpu,
  unternehmensbezug: Building2,
  sprache: Type,
  zukunft: TrendingUp,
  schluss: MessageSquare,
}

const CATEGORY_LABELS: Record<CoverLetterCategoryKey, string> = {
  grundstruktur: 'Grundstruktur & Aufbau',
  stellenbezug: 'Stellenbezug & Individualisierung',
  motivation: 'Motivation & Persönlichkeit',
  qualifikationen: 'Qualifikationen & Erfahrungen',
  kompetenzen: 'Kompetenzen & Stärken',
  unternehmensbezug: 'Unternehmensbezug',
  sprache: 'Sprache & Stil',
  zukunft: 'Zukunft & Mehrwert',
  schluss: 'Schluss & Gesprächsbereitschaft',
}

const STATUS_STYLES: Record<StatusColor, {
  border: string; badge: string; text: string; bg: string; barFrom: string; barTo: string
}> = {
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
  if (status === 'pass') return <Check className="w-3.5 h-3.5 text-status-green flex-shrink-0 mt-0.5" />
  if (status === 'warn') return <AlertTriangle className="w-3.5 h-3.5 text-status-yellow flex-shrink-0 mt-0.5" />
  return <X className="w-3.5 h-3.5 text-status-red flex-shrink-0 mt-0.5" />
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
    const duration = 800
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

function CLCategoryCard({
  categoryKey,
  category,
  delay,
}: {
  categoryKey: CoverLetterCategoryKey
  category: AnalysisCategory
  delay: number
}) {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const styles = STATUS_STYLES[category.status]
  const Icon = CATEGORY_ICONS[categoryKey]
  const label = CATEGORY_LABELS[categoryKey]

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
              {label}
            </h3>
          </div>
          <div className={cn(
            'text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-mono font-bold tabular-nums flex items-center gap-0.5',
            styles.badge
          )}>
            <AnimatedScore target={category.score} colorClass="" />
            <span className="text-[10px] opacity-60">/100</span>
          </div>
        </div>

        <AnimatedBar value={category.score} status={category.status} delay={delay} />
        <p className="text-xs text-muted leading-relaxed mt-2.5 mb-3">{category.feedback}</p>

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

        {hiddenCount > 0 && (
          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="mt-2.5 flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors duration-200 font-medium"
          >
            {expanded ? (
              <><ChevronUp className="w-3 h-3" />Ausblenden</>
            ) : (
              <><ChevronDown className="w-3 h-3" />Alle {hiddenCount} weiteren anzeigen</>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

function ImprovementCard({
  section,
  original,
  improved,
  reason,
  delay,
}: {
  section: string
  original: string
  improved: string
  reason: string
  delay: number
}) {
  const [showImproved, setShowImproved] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm"
    >
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface-2/60">
        <span className="font-syne font-semibold text-xs text-foreground">{section}</span>
        <span className="text-xs text-muted">{reason}</span>
      </div>
      <div className="p-4">
        <AnimatePresence mode="wait">
          {!showImproved ? (
            <motion.div
              key="original"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Original</p>
              <p className="text-sm text-foreground/70 leading-relaxed italic bg-status-red-light/50 px-3 py-2 rounded-xl border border-status-red/10">
                &ldquo;{original}&rdquo;
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="improved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Verbessert</p>
              <p className="text-sm text-foreground/80 leading-relaxed bg-status-green-light/50 px-3 py-2 rounded-xl border border-status-green/10">
                &ldquo;{improved}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setShowImproved(!showImproved)}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={cn(
            'mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200',
            showImproved
              ? 'bg-status-red-light text-status-red hover:bg-status-red-light/80'
              : 'bg-primary text-white hover:bg-primary-hover shadow-primary'
          )}
        >
          {showImproved ? (
            <>Original anzeigen</>
          ) : (
            <><ArrowRight className="w-3 h-3" />Verbesserung anzeigen</>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

function HumannessBar({ score }: { score: number }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const t = setTimeout(() => setWidth(score), 300)
    return () => clearTimeout(t)
  }, [isInView, score])

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5 text-muted" />
          <span className="text-xs text-muted">KI-generiert</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted">Authentisch</span>
          <User className="w-3.5 h-3.5 text-muted" />
        </div>
      </div>
      <div className="h-3 rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-peach to-status-green"
          style={{ width: `${width}%`, transition: 'width 0.8s ease-out' }}
        />
      </div>
      <div className="flex justify-center">
        <span className="text-xs font-mono font-bold text-foreground/70">{score}/100</span>
      </div>
    </div>
  )
}

export default function CoverLetterPanel({ result }: { result: CoverLetterResult }) {
  const getColor = (s: number) => {
    if (s >= 60) return '#16A34A'
    if (s >= 30) return '#D97706'
    return '#DC2626'
  }
  const getBg = (s: number) => {
    if (s >= 60) return '#DCFCE7'
    if (s >= 30) return '#FEF3C7'
    return '#FEE2E2'
  }

  const probStyles = {
    'Hoch': 'bg-status-green-light text-status-green border-status-green/25',
    'Mittel': 'bg-status-yellow-light text-status-yellow border-status-yellow/25',
    'Gering': 'bg-status-red-light text-status-red border-status-red/25',
  } as Record<string, string>

  const probStyle = probStyles[result.success_probability] ?? 'bg-surface-3 text-muted border-border'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Header metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall score */}
        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 flex flex-col items-center text-center">
          <span className="font-syne font-semibold text-sm text-foreground mb-3">Gesamt-Score</span>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="text-5xl font-mono font-black tabular-nums"
            style={{ color: getColor(result.overall_score) }}
          >
            {result.overall_score}
          </motion.div>
          <span
            className="font-syne font-bold text-sm px-2.5 py-0.5 rounded-lg mt-1"
            style={{ color: getColor(result.overall_score), background: getBg(result.overall_score) }}
          >
            {result.grade}
          </span>
        </div>

        {/* Humanness */}
        <div className="rounded-2xl border border-border bg-white shadow-sm p-5">
          <span className="font-syne font-semibold text-sm text-foreground block mb-3">Authentizität</span>
          <HumannessBar score={result.humanness_score} />
        </div>

        {/* Success probability */}
        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 flex flex-col items-center justify-center text-center">
          <span className="font-syne font-semibold text-sm text-foreground mb-3">Erfolgschance</span>
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
            className={cn(
              'text-lg font-syne font-black px-4 py-2 rounded-xl border',
              probStyle
            )}
          >
            {result.success_probability}
          </motion.div>
        </div>
      </div>

      {/* 3x3 Category Grid */}
      <div>
        <h3 className="font-syne font-semibold text-sm text-foreground mb-3">
          9 Analyse-Kategorien
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COVER_LETTER_CATEGORY_KEYS.map((key, i) => {
            const category = result.categories[key]
            if (!category) return null
            return (
              <CLCategoryCard
                key={key}
                categoryKey={key}
                category={category}
                delay={i * 0.05}
              />
            )
          })}
        </div>
      </div>

      {/* Top Improvements */}
      {result.top_improvements && result.top_improvements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-accent-teal" />
            <h3 className="font-syne font-semibold text-sm text-foreground">Top-3 Verbesserungen</h3>
            <span className="text-xs text-muted ml-1">— Klicke für Vorher/Nachher</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {result.top_improvements.slice(0, 3).map((imp, i) => (
              <ImprovementCard
                key={i}
                section={imp.section}
                original={imp.original}
                improved={imp.improved}
                reason={imp.reason}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
