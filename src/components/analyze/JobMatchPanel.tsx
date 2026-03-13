'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  Target, CheckCircle2, XCircle, Tag, Building2,
  Cpu, TrendingUp, Lightbulb,
} from 'lucide-react'
import type { JobMatchResult } from '@/types'
import { cn } from '@/lib/utils'

interface JobMatchPanelProps {
  result: JobMatchResult
}

function MiniScoreCircle({ score, grade }: { score: number; grade: string }) {
  const [animated, setAnimated] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 1200
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
  const circumference = 2 * Math.PI * 40
  const dashoffset = circumference - (animated / 100) * circumference

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative w-24 h-24"
    >
      <svg className="-rotate-90 w-full h-full" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="40" fill="none" stroke="#E8EAFD" strokeWidth="7" />
        <circle
          cx="48" cy="48" r="40"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{ transition: 'stroke-dashoffset 0.03s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-syne font-bold text-2xl tabular-nums leading-none" style={{ color }}>
          {animated}
        </span>
        <span
          className="font-syne font-bold text-xs px-1.5 py-0.5 rounded-lg -mt-0.5"
          style={{ color, background: getBg(score) }}
        >
          {grade}
        </span>
      </div>
    </motion.div>
  )
}

function SkillTag({ skill, type }: { skill: string; type: 'match' | 'missing' | 'nice' }) {
  const styles = {
    match: 'bg-status-green-light text-status-green border-status-green/25',
    missing: 'bg-status-red-light text-status-red border-status-red/25',
    nice: 'bg-surface-3 text-muted border-border',
  }
  const icons = {
    match: <CheckCircle2 className="w-3 h-3" />,
    missing: <XCircle className="w-3 h-3" />,
    nice: <Tag className="w-3 h-3" />,
  }

  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border',
        styles[type]
      )}
    >
      {icons[type]}
      {skill}
    </motion.span>
  )
}

export default function JobMatchPanel({ result }: JobMatchPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header: Score + Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-syne font-semibold text-sm text-foreground">Job Match</span>
          </div>
          <MiniScoreCircle score={result.overall_match_score} grade={result.grade} />
        </div>

        <div className="sm:col-span-2 rounded-2xl border border-border bg-white shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-accent-teal" />
            <span className="font-syne font-semibold text-sm text-foreground">Unternehmenskultur</span>
          </div>
          <p className="text-sm text-foreground/75 leading-relaxed mb-4">{result.company_culture}</p>
          <div className="h-px bg-border mb-3" />
          <p className="text-sm text-foreground/75 leading-relaxed">{result.feedback}</p>
        </div>
      </div>

      {/* Skills breakdown */}
      <div className="rounded-2xl border border-border bg-white shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="font-syne font-semibold text-sm text-foreground">Skills-Analyse</span>
          <div className="flex gap-3 ml-auto text-xs text-muted">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-green inline-block" />Vorhanden</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-red inline-block" />Fehlend</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-border inline-block" />Nice-to-have</span>
          </div>
        </div>

        {result.matching_skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Passende Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {result.matching_skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 400 }}
                >
                  <SkillTag skill={skill} type="match" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {result.missing_skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Fehlende Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {result.missing_skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 400 }}
                >
                  <SkillTag skill={skill} type="missing" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {result.nice_to_have_skills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Nice-to-have</p>
            <div className="flex flex-wrap gap-1.5">
              {result.nice_to_have_skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 400 }}
                >
                  <SkillTag skill={skill} type="nice" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ATS Keywords */}
      {result.ats_keywords.length > 0 && (
        <div className="rounded-2xl border border-accent-sky/20 bg-accent-sky-light/30 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-accent-sky" />
            <span className="font-syne font-semibold text-sm text-foreground">ATS-Keywords</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.ats_keywords.map((kw, i) => (
              <motion.span
                key={kw}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="text-xs px-2.5 py-1 rounded-full bg-white text-accent-sky border border-accent-sky/25 font-medium"
              >
                {kw}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Top Improvements */}
      {result.top_improvements.length > 0 && (
        <div className="rounded-2xl border border-accent-teal/20 bg-accent-teal-light/30 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent-teal" />
            <span className="font-syne font-semibold text-sm text-foreground">Top-Verbesserungen</span>
          </div>
          <ul className="space-y-3">
            {result.top_improvements.map((imp, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                className="flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-md bg-accent-teal/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-3 h-3 text-accent-teal" />
                </div>
                <span className="text-sm text-foreground/75 leading-relaxed">{imp}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}
