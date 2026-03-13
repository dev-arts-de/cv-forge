'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  Trophy, CheckCircle2, XCircle, Star, AlertCircle,
  Briefcase, Heart, Building2, Target, AlertTriangle,
} from 'lucide-react'
import type { FitScoreResult, SkillMatch } from '@/types'
import { cn } from '@/lib/utils'

interface FitScorePanelProps {
  result: FitScoreResult
}

function BigScoreCircle({ score, grade }: { score: number; grade: string }) {
  const [animated, setAnimated] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 1600
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setAnimated(Math.round(eased * score))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, score])

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

  const color = getColor(score)
  const circumference = 2 * Math.PI * 60
  const dashoffset = circumference - (animated / 100) * circumference

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
      className="relative w-44 h-44"
    >
      {/* Glow ring */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: color, opacity: 0.15 }}
      />
      <svg className="-rotate-90 w-full h-full relative z-10" viewBox="0 0 136 136">
        <circle cx="68" cy="68" r="60" fill="none" stroke="#E8EAFD" strokeWidth="10" />
        {/* Segment arcs for visual flair */}
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={i}
            cx="68" cy="68" r="60"
            fill="none"
            stroke="#DDE0F0"
            strokeWidth="1"
            strokeDasharray={`${circumference * 0.24} ${circumference * 0.01}`}
            strokeDashoffset={circumference * (1 - 0.25 * i)}
          />
        ))}
        <circle
          cx="68" cy="68" r="60"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{ transition: 'stroke-dashoffset 0.03s ease', filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="font-syne font-bold text-5xl tabular-nums leading-none" style={{ color }}>
          {animated}
        </span>
        <span
          className="font-syne font-bold text-base -mt-0.5 px-2.5 py-0.5 rounded-xl"
          style={{ color, background: getBg(score) }}
        >
          {grade}
        </span>
      </div>
    </motion.div>
  )
}

function SubScoreBar({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
  delay: number
}) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const t = setTimeout(() => setWidth(value), delay * 1000 + 200)
    return () => clearTimeout(t)
  }, [isInView, value, delay])

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const t = setTimeout(() => {
      const duration = 900
      const start = Date.now()
      const timer = setInterval(() => {
        const elapsed = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(Math.round(eased * value))
        if (progress >= 1) clearInterval(timer)
      }, 16)
      return () => clearInterval(timer)
    }, delay * 1000 + 200)
    return () => clearTimeout(t)
  }, [isInView, value, delay])

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className={cn('w-3.5 h-3.5', color)} />
          <span className="text-xs font-semibold text-foreground/75">{label}</span>
        </div>
        <span className="font-mono text-xs font-bold text-foreground/60 tabular-nums">{current}</span>
      </div>
      <div className="h-2.5 rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: `linear-gradient(to right, ${color.includes('green') ? '#16A34A, #4ADE80' : color.includes('sky') ? '#4BAAFF, #7DD3FC' : '#FF8C7A, #FCA5A5'})`,
            transition: 'width 0.8s ease-out',
          }}
        />
      </div>
    </div>
  )
}

function SkillRow({ skill, index }: { skill: SkillMatch; index: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index, type: 'spring', stiffness: 300 }}
      className="border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors"
    >
      <td className="py-2.5 pr-3 text-sm text-foreground/80 font-medium">{skill.skill}</td>
      <td className="py-2.5 pr-3">
        {skill.has ? (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-status-green" />
            <span className="text-xs text-status-green font-semibold">Vorhanden</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-status-red" />
            <span className="text-xs text-status-red font-semibold">Fehlt</span>
          </div>
        )}
      </td>
      <td className="py-2.5 pr-3">
        <span className={cn(
          'text-xs font-bold px-2 py-0.5 rounded-full border',
          skill.importance === 'must'
            ? 'bg-status-red-light text-status-red border-status-red/25'
            : 'bg-surface-3 text-muted border-border'
        )}>
          {skill.importance === 'must' ? 'Pflicht' : 'Optional'}
        </span>
      </td>
      <td className="py-2.5 text-xs text-muted">{skill.note ?? '—'}</td>
    </motion.tr>
  )
}

const RECOMMENDATION_STYLES = {
  strong: {
    bg: 'bg-status-green-light',
    border: 'border-status-green/30',
    text: 'text-status-green',
    icon: Trophy,
    glow: 'shadow-[0_0_30px_rgba(22,163,74,0.2)]',
  },
  good: {
    bg: 'bg-accent-sky-light',
    border: 'border-accent-sky/30',
    text: 'text-accent-sky',
    icon: Star,
    glow: 'shadow-[0_0_30px_rgba(75,170,255,0.2)]',
  },
  weak: {
    bg: 'bg-status-yellow-light',
    border: 'border-status-yellow/30',
    text: 'text-status-yellow',
    icon: AlertCircle,
    glow: 'shadow-[0_0_30px_rgba(217,119,6,0.2)]',
  },
}

export default function FitScorePanel({ result }: FitScorePanelProps) {
  const recStyle = RECOMMENDATION_STYLES[result.recommendation_level]
  const RecIcon = recStyle.icon

  const mustSkills = result.skills_match.filter(s => s.importance === 'must')
  const niceSkills = result.skills_match.filter(s => s.importance === 'nice')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Hero: Score + Recommendation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Big score */}
        <div className="rounded-2xl border border-border bg-white shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-syne font-semibold text-sm text-foreground">Passgenauigkeit</span>
          </div>
          <BigScoreCircle score={result.overall_fit} grade={result.grade} />
        </div>

        {/* Recommendation + Summary */}
        <div className="rounded-2xl border border-border bg-white shadow-sm p-6 flex flex-col">
          <span className="font-syne font-semibold text-sm text-foreground mb-4">Bewerbungs-Einschätzung</span>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.3 }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-2xl border mb-4',
              recStyle.bg, recStyle.border, recStyle.glow
            )}
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <RecIcon className={cn('w-6 h-6', recStyle.text)} />
            </motion.div>
            <span className={cn('font-syne font-black text-lg', recStyle.text)}>
              {result.recommendation}
            </span>
          </motion.div>

          <p className="text-sm text-foreground/70 leading-relaxed flex-1">{result.summary}</p>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="rounded-2xl border border-border bg-white shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-accent-yellow" />
          <span className="font-syne font-semibold text-sm text-foreground">Teilbewertungen</span>
        </div>
        <div className="space-y-4">
          <SubScoreBar
            label="Berufserfahrung"
            value={result.experience_fit}
            icon={Briefcase}
            color="text-status-green"
            delay={0}
          />
          <SubScoreBar
            label="Motivation"
            value={result.motivation_fit}
            icon={Heart}
            color="text-accent-peach"
            delay={0.1}
          />
          <SubScoreBar
            label="Kulturfit"
            value={result.culture_fit}
            icon={Building2}
            color="text-accent-sky"
            delay={0.2}
          />
        </div>
      </div>

      {/* Missing critical skills */}
      {result.missing_critical.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
          className="rounded-2xl border border-status-red/25 bg-status-red-light/30 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-status-red" />
            <span className="font-syne font-semibold text-sm text-status-red">Kritische Lücken</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missing_critical.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-status-red-light text-status-red border border-status-red/25"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Skills table */}
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-surface-2/60 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="font-syne font-semibold text-sm text-foreground">Skills-Übersicht</span>
          <div className="ml-auto flex gap-3 text-xs text-muted">
            <span>{result.skills_match.filter(s => s.has).length} vorhanden</span>
            <span>{result.skills_match.filter(s => !s.has).length} fehlend</span>
          </div>
        </div>

        {mustSkills.length > 0 && (
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-bold text-muted uppercase tracking-wide mb-2">Pflichtanforderungen</p>
            <table className="w-full">
              <tbody>
                {mustSkills.map((skill, i) => (
                  <SkillRow key={skill.skill} skill={skill} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {niceSkills.length > 0 && (
          <div className="px-5 pt-2 pb-4">
            <p className="text-xs font-bold text-muted uppercase tracking-wide mb-2">Nice-to-have</p>
            <table className="w-full">
              <tbody>
                {niceSkills.map((skill, i) => (
                  <SkillRow key={skill.skill} skill={skill} index={mustSkills.length + i} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}
