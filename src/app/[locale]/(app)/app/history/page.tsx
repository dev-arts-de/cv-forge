'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Mail, Trash2, Download, ChevronRight, Target, Calendar, BarChart2, Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import Navbar from '@/components/shared/Navbar'
import AppFooter from '@/components/shared/AppFooter'
import { cn } from '@/lib/utils'

type Tab = 'analyses' | 'letters'

interface AnalysisSummary {
  id: string
  cvFileName: string | null
  jobTitle: string | null
  overallScore: number | null
  createdAt: string
}

interface CoverLetterSummary {
  id: string
  jobTitle: string | null
  text: string
  createdAt: string
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null
  const color =
    score >= 75 ? 'text-status-green bg-status-green-light border-status-green/20'
    : score >= 50 ? 'text-status-yellow bg-status-yellow-light border-status-yellow/20'
    : 'text-status-red bg-status-red-light border-status-red/20'
  return (
    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-bold border', color)}>
      <BarChart2 className="w-2.5 h-2.5" />
      {score}%
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function HistoryPage() {
  const locale = useLocale()
  const [tab, setTab] = useState<Tab>('analyses')
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([])
  const [letters, setLetters] = useState<CoverLetterSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [a, l] = await Promise.all([
      fetch('/api/analyses').then(r => r.ok ? r.json() : []),
      fetch('/api/cover-letters').then(r => r.ok ? r.json() : []),
    ])
    setAnalyses(a)
    setLetters(l)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const deleteAnalysis = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setDeletingId(id)
    await fetch(`/api/analyses/${id}`, { method: 'DELETE' })
    setAnalyses(prev => prev.filter(a => a.id !== id))
    setDeletingId(null)
  }

  const deleteLetter = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setDeletingId(id)
    await fetch(`/api/cover-letters/${id}`, { method: 'DELETE' })
    setLetters(prev => prev.filter(l => l.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/6 blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-accent-sky/5 blur-[100px]" />
      </div>

      <Navbar />

      <div className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-end justify-between mb-7"
        >
          <div>
            <h1 className="font-syne font-bold text-2xl sm:text-3xl text-foreground">Verlauf</h1>
            <p className="text-sm text-muted mt-0.5">Analysen &amp; Anschreiben</p>
          </div>
          <Link
            href={`/${locale}/app/analyze`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Neue Analyse</span>
            <span className="sm:hidden">Neu</span>
          </Link>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-2 rounded-2xl border border-border w-fit mb-5">
          {([
            { id: 'analyses' as Tab, label: 'Analysen', icon: FileText, count: analyses.length },
            { id: 'letters' as Tab, label: 'Anschreiben', icon: Mail, count: letters.length },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                tab === t.id ? 'bg-white text-foreground shadow-sm border border-border' : 'text-muted hover:text-foreground'
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {!loading && (
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                  tab === t.id ? 'bg-primary/10 text-primary' : 'bg-border/80 text-muted'
                )}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {tab === 'analyses' && (
              <motion.div key="analyses" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {analyses.length === 0 ? (
                  <EmptyState icon={Target} title="Noch keine Analysen" desc="Starte eine CV-Analyse — sie wird automatisch gespeichert." href={`/${locale}/app/analyze`} cta="Jetzt analysieren" />
                ) : (
                  <div className="space-y-2">
                    {analyses.map((a, i) => (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                        <Link
                          href={`/${locale}/app/history/analyses/${a.id}`}
                          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-border bg-white hover:border-primary/20 hover:shadow-sm transition-all duration-200 group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-primary/8 group-hover:border-primary/20 transition-colors">
                            <FileText className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{a.cvFileName ?? 'Lebenslauf'}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="flex items-center gap-1 text-[11px] text-muted">
                                <Calendar className="w-2.5 h-2.5" />{formatDate(a.createdAt)}
                              </span>
                              {a.jobTitle && <span className="text-[11px] text-muted truncate max-w-[160px]">· {a.jobTitle}</span>}
                              <ScoreBadge score={a.overallScore} />
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={(e) => deleteAnalysis(e, a.id)}
                              disabled={deletingId === a.id}
                              className="w-7 h-7 rounded-lg hover:bg-status-red-light flex items-center justify-center text-muted hover:text-status-red transition-colors"
                            >
                              {deletingId === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted/30 group-hover:text-primary/50 transition-colors flex-shrink-0" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'letters' && (
              <motion.div key="letters" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {letters.length === 0 ? (
                  <EmptyState icon={Mail} title="Noch keine Anschreiben" desc="Nutze den Anschreibomat um dein erstes Anschreiben zu generieren." href={`/${locale}/app/analyze`} cta="Zum Anschreibomat" />
                ) : (
                  <div className="space-y-2">
                    {letters.map((l, i) => (
                      <motion.div key={l.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                        <Link
                          href={`/${locale}/app/history/letters/${l.id}`}
                          className="flex items-start gap-3 px-4 py-4 rounded-2xl border border-border bg-white hover:border-accent-teal/20 hover:shadow-sm transition-all duration-200 group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent-teal/8 group-hover:border-accent-teal/20 transition-colors">
                            <Mail className="w-4 h-4 text-muted group-hover:text-accent-teal transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{l.jobTitle ?? 'Anschreiben'}</p>
                            <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{l.text.slice(0, 100)}</p>
                            <span className="flex items-center gap-1 text-[11px] text-muted mt-1">
                              <Calendar className="w-2.5 h-2.5" />{formatDate(l.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                            <button
                              onClick={(e) => deleteLetter(e, l.id)}
                              disabled={deletingId === l.id}
                              className="w-7 h-7 rounded-lg hover:bg-status-red-light flex items-center justify-center text-muted hover:text-status-red transition-colors"
                            >
                              {deletingId === l.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted/30 group-hover:text-accent-teal/50 transition-colors flex-shrink-0 mt-0.5" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <AppFooter />
    </div>
  )
}

function EmptyState({ icon: Icon, title, desc, href, cta }: {
  icon: React.ElementType; title: string; desc: string; href: string; cta: string
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center py-20 px-6">
      <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-muted" />
      </div>
      <h3 className="font-syne font-bold text-base text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted mb-6 max-w-xs leading-relaxed">{desc}</p>
      <Link href={href} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-colors">
        {cta}
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  )
}
