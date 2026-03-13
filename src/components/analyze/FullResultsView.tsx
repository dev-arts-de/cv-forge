'use client'

import { useState } from 'react'
import { useScrollLock } from '@/hooks/useScrollLock'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Briefcase, Mail, Target, Wand2, ArrowUpRight, X, Calendar, Building2, Eye, ExternalLink, AlignLeft } from 'lucide-react'
import Image from 'next/image'
import ResultsGrid from './ResultsGrid'
import JobMatchPanel from './JobMatchPanel'
import CoverLetterPanel from './CoverLetterPanel'
import FitScorePanel from './FitScorePanel'
import CoverLetterBuilder from './CoverLetterBuilder'
import CVViewer from './CVViewer'
import type { FullAnalysisResult } from '@/types'
import { cn } from '@/lib/utils'

interface FullResultsViewProps {
  result: FullAnalysisResult
  cvText?: string
  cvFileUrl?: string
  jobText?: string
  coverLetterText?: string
  cvFileName?: string
  onReset: () => void
}

type TabId = 'cv' | 'job' | 'cover_letter' | 'fit' | 'builder'

interface Tab {
  id: TabId
  label: string
  icon: React.ElementType
  available: boolean
  accent?: string
}

function CVModal({ text, fileUrl, onClose }: { text: string; fileUrl?: string; onClose: () => void }) {
  useScrollLock()
  const [activeTab, setActiveTab] = useState<'pdf' | 'text'>(fileUrl ? 'pdf' : 'text')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm touch-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        style={{ '--initial-scale': 0.95 } as React.CSSProperties}
        className="relative w-full sm:max-w-2xl h-[92dvh] sm:h-[85vh] rounded-t-3xl sm:rounded-2xl border border-border bg-white shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar (mobile) */}
        <div className="flex-shrink-0 flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border bg-surface-2/60 flex-shrink-0">
          <div className="flex items-center gap-1 p-0.5 bg-surface-3 rounded-xl border border-border">
            {fileUrl && (
              <button
                onClick={() => setActiveTab('pdf')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                  activeTab === 'pdf'
                    ? 'bg-white text-primary shadow-sm border border-border'
                    : 'text-muted hover:text-foreground'
                )}
              >
                <FileText className="w-3 h-3" />
                PDF
              </button>
            )}
            <button
              onClick={() => setActiveTab('text')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                activeTab === 'text'
                  ? 'bg-white text-primary shadow-sm border border-border'
                  : 'text-muted hover:text-foreground'
              )}
            >
              <AlignLeft className="w-3 h-3" />
              Text
            </button>
          </div>

          <div className="flex items-center gap-2">
            {fileUrl && activeTab === 'pdf' && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-surface-3 transition-colors border border-transparent hover:border-border"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">Öffnen</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg hover:bg-border/60 flex items-center justify-center text-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'pdf' && fileUrl ? (
            <iframe
              src={fileUrl}
              className="w-full h-full border-0"
              title="Lebenslauf PDF"
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <CVViewer text={text} />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function AnalysisContextBar({
  cvFileName,
  jobText,
  cvText,
}: {
  cvFileName?: string
  jobText?: string
  cvText?: string
}) {
  const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })

  const candidateName = (() => {
    if (cvFileName) {
      const n = cvFileName.replace(/\.(pdf|txt)$/i, '').replace(/[-_]/g, ' ')
      if (n.length > 0 && n.length < 50) return n
    }
    if (cvText) {
      const firstLines = cvText.split('\n').slice(0, 5)
      for (const line of firstLines) {
        const clean = line.trim()
        if (clean.length > 3 && clean.length < 40 && /^[A-ZÄÖÜ]/.test(clean) && !clean.includes('@') && !clean.includes(':')) {
          return clean
        }
      }
    }
    return 'Lebenslauf'
  })()

  const jobTitle = (() => {
    if (!jobText) return null
    if (jobText.startsWith('http')) return 'Stellenausschreibung (URL)'
    const firstLines = jobText.split('\n').slice(0, 3)
    for (const line of firstLines) {
      const clean = line.trim()
      if (clean.length > 5 && clean.length < 80) return clean
    }
    return null
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-white shadow-sm px-4 sm:px-5 py-3.5 flex flex-wrap items-center gap-3 sm:gap-4"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted uppercase tracking-wide font-semibold">Analysierter Lebenslauf</p>
          <p className="text-sm font-semibold text-foreground truncate">{candidateName}</p>
        </div>
      </div>

      {jobTitle && (
        <>
          <div className="w-px h-8 bg-border hidden sm:block" />
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-accent-teal/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-accent-teal" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted uppercase tracking-wide font-semibold">Zielstelle</p>
              <p className="text-sm font-semibold text-foreground truncate max-w-[160px] sm:max-w-[220px]">{jobTitle}</p>
            </div>
          </div>
        </>
      )}

      <div className="w-px h-8 bg-border hidden sm:block" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-4 h-4 text-muted" />
        </div>
        <div>
          <p className="text-[10px] text-muted uppercase tracking-wide font-semibold">Analysiert am</p>
          <p className="text-sm font-semibold text-foreground">{today}</p>
        </div>
      </div>
    </motion.div>
  )
}

function PortfolioTeaser() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.4 }}
      className="relative rounded-2xl border border-border overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-sky-light via-white to-primary-light opacity-70" />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-primary/8 blur-3xl pointer-events-none"
      />
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
        <motion.div
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 flex-shrink-0"
        >
          <Image src="/Foxfolio-logo500x500.png" alt="Foxfolio" width={40} height={40} className="object-contain" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-syne font-bold text-foreground text-sm">Foxfolio — Dein Online-Portfolio</h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent-sky/15 text-accent-sky border border-accent-sky/20">Bald</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Erstelle deine eigene Portfolio-Seite und mache dich online auffindbar — mit Projekten, Lebenslauf und Referenzen.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-border text-foreground/70 text-xs font-semibold hover:border-accent-sky/40 hover:text-accent-sky transition-all duration-200 flex-shrink-0 shadow-sm"
        >
          Vormerken
          <ArrowUpRight className="w-3 h-3" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function FullResultsView({ result, cvText, cvFileUrl, jobText, coverLetterText, cvFileName }: FullResultsViewProps) {
  const hasCoverLetterData = !!result.cover_letter
  const hasJobData = !!result.job_match
  const hasBuilderData = !!(cvText || result.cv_analysis)

  const tabs: Tab[] = ([
    { id: 'cv' as TabId,            label: 'Analyse',                icon: FileText,  available: true },
    { id: 'job' as TabId,           label: 'Job Match',              icon: Briefcase, available: hasJobData },
    { id: 'cover_letter' as TabId,  label: 'Anschreiben',            icon: Mail,      available: hasCoverLetterData },
    { id: 'fit' as TabId,           label: 'Passgenauigkeit',        icon: Target,    available: !!result.fit_score },
    { id: 'builder' as TabId,       label: 'Anschreibomat',          icon: Wand2,     available: hasBuilderData, accent: 'accent-orange' },
  ] as Tab[]).filter((t) => t.available)

  const [activeTab, setActiveTab] = useState<TabId>('cv')
  const [cvModalOpen, setCvModalOpen] = useState(false)
  // Track which tabs have been visited so we lazy-init them but never unmount them
  const [visitedTabs, setVisitedTabs] = useState<Set<TabId>>(new Set(['cv']))

  const handleTabChange = (id: TabId) => {
    setActiveTab(id)
    setVisitedTabs((prev) => { const next = new Set(prev); next.add(id); return next })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Context bar */}
      <AnalysisContextBar cvFileName={cvFileName} jobText={jobText} cvText={cvText} />

      {/* Tab bar */}
      <div className="rounded-2xl border border-border bg-white shadow-sm p-1.5 flex gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isOrange = tab.accent === 'accent-orange'

          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex-shrink-0 transition-all duration-200',
                isActive
                  ? isOrange ? 'text-accent-orange' : 'text-primary'
                  : 'text-muted hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className={cn(
                    'absolute inset-0 rounded-xl border',
                    isOrange ? 'bg-accent-orange/8 border-accent-orange/20' : 'bg-primary/8 border-primary/20'
                  )}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10 flex-shrink-0" />
              <span className="relative z-10 whitespace-nowrap hidden sm:inline">{tab.label}</span>
              {isOrange && !isActive && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-accent-orange relative z-10"
                />
              )}
            </motion.button>
          )
        })}

        {/* CV Preview button */}
        {cvText && cvText.length > 0 && (
          <motion.button
            onClick={() => setCvModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-muted hover:text-foreground hover:bg-surface-2 transition-all duration-200 flex-shrink-0 border border-border"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CV ansehen</span>
          </motion.button>
        )}
      </div>

      {/* Tab content — panels are lazy-mounted on first visit and kept in DOM to preserve state */}
      <div className="relative">
        {visitedTabs.has('cv') && (
          <motion.div
            key="cv"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={activeTab === 'cv' ? '' : 'hidden'}
          >
            <ResultsGrid result={result.cv_analysis} />
          </motion.div>
        )}

        {visitedTabs.has('job') && result.job_match && (
          <motion.div
            key="job"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={activeTab === 'job' ? '' : 'hidden'}
          >
            <JobMatchPanel result={result.job_match} />
          </motion.div>
        )}

        {visitedTabs.has('cover_letter') && result.cover_letter && (
          <motion.div
            key="cover_letter"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={activeTab === 'cover_letter' ? '' : 'hidden'}
          >
            <CoverLetterPanel result={result.cover_letter} />
          </motion.div>
        )}

        {visitedTabs.has('fit') && result.fit_score && (
          <motion.div
            key="fit"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={activeTab === 'fit' ? '' : 'hidden'}
          >
            <FitScorePanel result={result.fit_score} />
          </motion.div>
        )}

        {visitedTabs.has('builder') && (
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={cn(
              'rounded-2xl border border-border bg-white shadow-sm p-4 sm:p-6',
              activeTab === 'builder' ? '' : 'hidden'
            )}
          >
            <CoverLetterBuilder
              cvText={cvText ?? ''}
              jobText={jobText ?? ''}
              existingLetter={coverLetterText}
            />
          </motion.div>
        )}
      </div>

      {/* Portfolio teaser */}
      <PortfolioTeaser />

      {/* CV Modal */}
      <AnimatePresence>
        {cvModalOpen && cvText && (
          <CVModal text={cvText} fileUrl={cvFileUrl} onClose={() => setCvModalOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
