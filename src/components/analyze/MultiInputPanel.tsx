'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, X, Sparkles, Link, Type,
  ChevronDown, Plus, Briefcase, Mail, CheckCircle2, Zap, LogIn,
  BookOpen, Check, Target, TrendingUp, MessageSquare,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import NextLink from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useCredits } from '@/hooks/useCredits'
import { useSession } from 'next-auth/react'
import type { AnalysisInput } from '@/types'
import CreditsPurchaseModal from '@/components/shared/CreditsPurchaseModal'
import { useSavedCVs, type SavedCV } from '@/hooks/useSavedCVs'

interface MultiInputPanelProps {
  onAnalyze: (input: AnalysisInput) => Promise<void>
  isAnalyzing: boolean
}

type CVInputMode = 'file' | 'text'
type JobInputMode = 'url' | 'text'
type CLInputMode = 'file' | 'text'

const MAX_SIZE = 5 * 1024 * 1024

function validateFile(f: File): string | null {
  if (f.size > MAX_SIZE) return 'Datei zu groß. Maximum 5MB.'
  if (!['application/pdf', 'text/plain'].includes(f.type))
    return 'Nur PDF- und TXT-Dateien werden unterstützt.'
  return null
}

function PillTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: React.ElementType }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-1 p-0.5 bg-surface-2 rounded-xl border border-border">
      {options.map((opt) => {
        const Icon = opt.icon
        return (
          <motion.button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
              value === opt.value
                ? 'bg-white text-primary shadow-sm border border-border'
                : 'text-muted hover:text-foreground'
            )}
          >
            {Icon && <Icon className="w-3 h-3" />}
            {opt.label}
          </motion.button>
        )
      })}
    </div>
  )
}

function FileDropZone({
  file,
  onFile,
  onRemove,
  label,
}: {
  file: File | null
  onFile: (f: File) => void
  onRemove: () => void
  label: string
}) {
  const [isDragging, setIsDragging] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const f = e.dataTransfer.files[0]
      if (f) onFile(f)
    },
    [onFile]
  )

  return (
    <motion.div
      animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
      onDrop={handleDrop}
      onClick={() => !file && ref.current?.click()}
      className={cn(
        'relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer',
        isDragging ? 'border-primary bg-primary/5' :
        file ? 'border-primary/40 bg-primary/[0.03] cursor-default' :
        'border-border hover:border-primary/50 hover:bg-surface-2'
      )}
    >
      <input
        ref={ref}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }}
      />
      <div className="p-4">
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onRemove() }}
                className="w-7 h-7 rounded-lg bg-border/60 hover:bg-status-red-light flex items-center justify-center text-muted hover:text-status-red transition-all duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300',
                isDragging ? 'bg-primary/15 border border-primary/30' : 'bg-surface-3 border border-border'
              )}>
                <Upload className={cn('w-4 h-4 transition-colors', isDragging ? 'text-primary' : 'text-muted')} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/80">{label}</p>
                <p className="text-xs text-muted">PDF oder TXT, max. 5MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function SavedCVPicker({
  cvs,
  selectedId,
  onSelect,
}: {
  cvs: SavedCV[]
  selectedId: string | null
  onSelect: (cv: SavedCV | null) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = cvs.find(c => c.id === selectedId) ?? null

  if (cvs.length === 0) return null

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200',
          selected
            ? 'border-primary/40 bg-primary/[0.04] text-foreground'
            : 'border-border bg-surface-2/60 text-muted hover:border-primary/30 hover:bg-surface-2'
        )}
      >
        <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-primary/70" />
        <span className="flex-1 text-left truncate font-medium text-xs">
          {selected ? selected.name : `Gespeicherten Lebenslauf verwenden (${cvs.length})`}
        </span>
        {selected && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onSelect(null) }}
            className="w-5 h-5 rounded-md bg-border/60 hover:bg-status-red-light flex items-center justify-center text-muted hover:text-status-red transition-all"
          >
            <X className="w-3 h-3" />
          </motion.button>
        )}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
          <ChevronDown className="w-3.5 h-3.5 text-muted/60" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute top-full left-0 right-0 mt-1.5 z-20 rounded-xl border border-border bg-white shadow-lg overflow-hidden"
          >
            {cvs.map((cv) => (
              <button
                key={cv.id}
                type="button"
                onClick={() => { onSelect(cv); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-surface-2 transition-colors group"
              >
                <div className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
                  cv.id === selectedId ? 'bg-primary text-white' : 'bg-surface-3 text-muted border border-border group-hover:border-primary/30'
                )}>
                  {cv.id === selectedId ? <Check className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{cv.name}</p>
                  <p className="text-[10px] text-muted">
                    {cv.lastUsedAt
                      ? `Zuletzt: ${new Date(cv.lastUsedAt).toLocaleDateString('de-DE')}`
                      : new Date(cv.createdAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MultiInputPanel({ onAnalyze, isAnalyzing }: MultiInputPanelProps) {
  const locale = useLocale()
  const { data: session, status: sessionStatus } = useSession()
  const isLoggedIn = !!session?.user
  const { balance, mounted, costs, addCredits } = useCredits()
  const { cvs } = useSavedCVs()
  const [anschreibomatLogoError, setAnschreibomatLogoError] = useState(false)
  const hasCredits = !mounted || sessionStatus === 'loading' || balance >= costs.analysis
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)

  const [cvMode, setCvMode] = useState<CVInputMode>('file')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvText, setCvText] = useState('')
  const [cvError, setCvError] = useState<string | null>(null)
  const [selectedSavedCV, setSelectedSavedCV] = useState<SavedCV | null>(null)

  const [jobEnabled, setJobEnabled] = useState(false)
  const [jobMode, setJobMode] = useState<JobInputMode>('url')
  const [jobUrl, setJobUrl] = useState('')
  const [jobText, setJobText] = useState('')

  const [clEnabled, setClEnabled] = useState(false)
  const [clMode, setClMode] = useState<CLInputMode>('file')
  const [clFile, setClFile] = useState<File | null>(null)
  const [clText, setClText] = useState('')

  const handleCvFile = (f: File) => {
    const err = validateFile(f)
    if (err) { setCvError(err); return }
    setCvFile(f)
    setCvText('')
    setCvError(null)
  }

  const handleClFile = (f: File) => {
    const err = validateFile(f)
    if (err) return
    setClFile(f)
    setClText('')
  }

  const hasCv = cvFile !== null || cvText.trim().length > 50 || selectedSavedCV !== null
  const hasJob = jobEnabled && (
    (jobMode === 'url' && jobUrl.trim().length > 10) ||
    (jobMode === 'text' && jobText.trim().length > 50)
  )
  const hasCoverLetter = jobEnabled && clEnabled && (
    clFile !== null || clText.trim().length > 50
  )

  const handleSubmit = async () => {
    if (!hasCv) return
    setCvError(null)

    const input: AnalysisInput = { cvText: '' }

    if (cvFile) {
      input.cvFileName = cvFile.name
      input.cvFileUrl = URL.createObjectURL(cvFile)
    } else if (selectedSavedCV) {
      input.cvText = selectedSavedCV.text
      input.cvFileName = selectedSavedCV.name
    } else {
      input.cvText = cvText.trim()
    }

    if (hasJob) {
      if (jobMode === 'url') input.jobUrl = jobUrl.trim()
      else input.jobText = jobText.trim()
    }

    if (hasCoverLetter) {
      if (clMode === 'text') input.coverLetterText = clText.trim()
    }

    const formData = new FormData()

    if (cvFile) {
      formData.append('cv', cvFile)
    } else if (selectedSavedCV) {
      formData.append('cv_text', selectedSavedCV.text)
    } else {
      formData.append('cv_text', cvText.trim())
    }

    if (hasJob) {
      if (jobMode === 'url') formData.append('job_url', jobUrl.trim())
      else formData.append('job_text', jobText.trim())
    }

    if (hasCoverLetter) {
      if (clMode === 'file' && clFile) {
        formData.append('cover_letter', clFile)
      } else if (clMode === 'text' && clText.trim()) {
        formData.append('cover_letter_text', clText.trim())
      }
    }

    await onAnalyze({ ...input, _formData: formData } as AnalysisInput & { _formData: FormData })
  }

  return (
    <>
    {purchaseModalOpen && (
      <CreditsPurchaseModal
        currentBalance={balance}
        onClose={() => setPurchaseModalOpen(false)}
        onSuccess={(newBalance) => {
          addCredits(newBalance - balance)
          setPurchaseModalOpen(false)
        }}
      />
    )}
    <div className="space-y-3">

      {/* ── Step 1: Lebenslauf ─────────────────────────────── */}
      <div className={cn(
        'rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-300',
        hasCv ? 'border-primary/30' : 'border-border'
      )}>
        <div className="px-4 sm:px-5 py-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold transition-all duration-300',
              hasCv ? 'bg-primary text-white' : 'bg-surface-3 text-muted border border-border'
            )}>
              {hasCv ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex-shrink-0">
                <Image
                  src="/Talentblick-logo500x500.png"
                  alt="Talentblick"
                  width={28}
                  height={28}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <span className="font-syne font-semibold text-sm text-foreground">Lebenslauf hochladen</span>
                <p className="text-[11px] text-muted leading-tight mt-0.5">
                  Basis für alle Analysen — PDF oder Text
                </p>
              </div>
            </div>
          </div>
          {!selectedSavedCV && (
            <PillTabs
              options={[
                { value: 'file' as CVInputMode, label: 'PDF', icon: Upload },
                { value: 'text' as CVInputMode, label: 'Text', icon: Type },
              ]}
              value={cvMode}
              onChange={setCvMode}
            />
          )}
        </div>
        <div className="p-4 sm:p-5 space-y-3">
          {isLoggedIn && (
            <SavedCVPicker
              cvs={cvs}
              selectedId={selectedSavedCV?.id ?? null}
              onSelect={(cv) => {
                setSelectedSavedCV(cv)
                if (cv) { setCvFile(null); setCvText('') }
              }}
            />
          )}
          <AnimatePresence mode="wait">
            {selectedSavedCV ? (
              <motion.div
                key="saved-cv-preview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-primary/[0.04]"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">{selectedSavedCV.name}</p>
                  <p className="text-xs text-muted">{Math.round(selectedSavedCV.text.length / 5)} Wörter · gespeichert</p>
                </div>
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
              </motion.div>
            ) : cvMode === 'file' ? (
              <motion.div
                key="cv-file"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <FileDropZone
                  file={cvFile}
                  onFile={handleCvFile}
                  onRemove={() => setCvFile(null)}
                  label="Lebenslauf hier ablegen"
                />
              </motion.div>
            ) : (
              <motion.div
                key="cv-text"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Lebenslauf-Text hier einfügen..."
                  rows={7}
                  className="w-full rounded-xl border border-border bg-surface-2/50 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none transition-all duration-200"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {cvError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-status-red-light border border-status-red/20 text-status-red text-xs"
              >
                <X className="w-3.5 h-3.5 flex-shrink-0" />
                {cvError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Step 2: Stelle (optional) ──────────────────────── */}
      <div className={cn(
        'rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-300',
        jobEnabled ? 'border-accent-teal/30' : 'border-border'
      )}>
        <button
          onClick={() => {
            const next = !jobEnabled
            setJobEnabled(next)
            if (!next) setClEnabled(false)
          }}
          className="w-full px-4 sm:px-5 py-4 flex items-center gap-3 text-left"
        >
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold transition-all duration-300',
            jobEnabled ? 'bg-accent-teal text-white' : 'bg-surface-3 text-muted border border-border'
          )}>
            {hasJob ? <Check className="w-3.5 h-3.5" /> : '2'}
          </div>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 flex-shrink-0">
              {!anschreibomatLogoError ? (
                <Image
                  src="/Anschreibomat-logo500x500.png"
                  alt="Anschreibomat"
                  width={28}
                  height={28}
                  className="object-contain w-full h-full"
                  onError={() => setAnschreibomatLogoError(true)}
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-surface-3 border border-border flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5 text-muted" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span className="font-syne font-semibold text-sm text-foreground">
                Stellenausschreibung hinzufügen
              </span>
              <p className="text-[11px] text-muted leading-tight mt-0.5">
                {jobEnabled
                  ? 'Aktiviert: Job-Match · Passgenauigkeit · Anschreiben'
                  : 'Optional — schaltet Job-Match & Anschreiben frei'}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: jobEnabled ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-muted" />
          </motion.div>
        </button>

        <AnimatePresence>
          {jobEnabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border/60">

                {/* What you unlock */}
                <div className="px-4 sm:px-5 pt-4 pb-3 flex flex-wrap gap-2">
                  {[
                    { icon: Target, label: 'Job-Match Score', color: 'text-accent-teal' },
                    { icon: TrendingUp, label: 'Passgenauigkeit', color: 'text-accent-peach' },
                    { icon: MessageSquare, label: 'Anschreiben möglich', color: 'text-accent-sky' },
                  ].map(({ icon: Icon, label, color }) => (
                    <span key={label} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted bg-surface-2 border border-border rounded-full px-2.5 py-1">
                      <Icon className={cn('w-3 h-3', color)} />
                      {label}
                    </span>
                  ))}
                </div>

                {/* Job input */}
                <div className="px-4 sm:px-5 pb-4 space-y-3">
                  <PillTabs
                    options={[
                      { value: 'url' as JobInputMode, label: 'URL', icon: Link },
                      { value: 'text' as JobInputMode, label: 'Text', icon: Type },
                    ]}
                    value={jobMode}
                    onChange={setJobMode}
                  />
                  <AnimatePresence mode="wait">
                    {jobMode === 'url' ? (
                      <motion.div
                        key="job-url"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="relative"
                      >
                        <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                        <input
                          type="url"
                          value={jobUrl}
                          onChange={(e) => setJobUrl(e.target.value)}
                          placeholder="https://unternehmen.de/jobs/softwareentwickler"
                          className="w-full rounded-xl border border-border bg-surface-2/50 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="job-text"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      >
                        <textarea
                          value={jobText}
                          onChange={(e) => setJobText(e.target.value)}
                          placeholder="Stellenausschreibung hier einfügen..."
                          rows={5}
                          className="w-full rounded-xl border border-border bg-surface-2/50 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none transition-all duration-200"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cover letter sub-section */}
                <div className="border-t border-border/60">
                  <button
                    onClick={() => setClEnabled(!clEnabled)}
                    className="w-full px-4 sm:px-5 py-3 flex items-center gap-3 text-left"
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 text-[10px] font-bold',
                      clEnabled ? 'bg-accent-sky text-white' : 'bg-surface-3 text-muted border border-border'
                    )}>
                      {hasCoverLetter ? <Check className="w-3 h-3" /> : '3'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        'font-syne font-semibold text-xs transition-colors duration-200',
                        clEnabled ? 'text-foreground' : 'text-muted'
                      )}>
                        Anschreiben für Bewertung hinzufügen
                      </span>
                      <p className="text-[11px] text-muted/70 mt-0.5">
                        Optional — dein bestehendes Anschreiben wird mitbewertet
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: clEnabled ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-muted" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {clEnabled && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-4 pt-1 space-y-3">
                          <PillTabs
                            options={[
                              { value: 'file' as CLInputMode, label: 'PDF', icon: Upload },
                              { value: 'text' as CLInputMode, label: 'Text', icon: Type },
                            ]}
                            value={clMode}
                            onChange={setClMode}
                          />
                          <AnimatePresence mode="wait">
                            {clMode === 'file' ? (
                              <motion.div
                                key="cl-file"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              >
                                <FileDropZone
                                  file={clFile}
                                  onFile={handleClFile}
                                  onRemove={() => setClFile(null)}
                                  label="Anschreiben hier ablegen"
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="cl-text"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              >
                                <textarea
                                  value={clText}
                                  onChange={(e) => setClText(e.target.value)}
                                  placeholder="Anschreiben-Text hier einfügen..."
                                  rows={5}
                                  className="w-full rounded-xl border border-border bg-surface-2/50 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none transition-all duration-200"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Submit ─────────────────────────────────────────── */}
      <div className="space-y-2.5 pt-1">

        {!isLoggedIn ? (
          <NextLink href={`/${locale}/auth`}>
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2.5 bg-primary text-white shadow-primary cursor-pointer overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <LogIn className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Anmelden &amp; Analyse starten</span>
            </motion.div>
          </NextLink>
        ) : !hasCredits ? (
          <div className="space-y-2">
            <div className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2.5 bg-surface-3 text-muted cursor-not-allowed">
              <Zap className="w-4 h-4" />
              Nicht genug Credits
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 rounded-xl bg-status-red-light border border-status-red/20">
              <span className="text-xs text-status-red font-medium">
                Du hast {balance} Credits — eine Analyse kostet {costs.analysis}
              </span>
              <button
                onClick={() => setPurchaseModalOpen(true)}
                className="text-xs font-bold text-status-red underline underline-offset-2 flex-shrink-0 hover:no-underline self-start sm:self-auto"
              >
                Credits kaufen
              </button>
            </div>
          </div>
        ) : (
          <motion.button
            onClick={handleSubmit}
            disabled={!hasCv || isAnalyzing}
            whileHover={hasCv && !isAnalyzing ? { scale: 1.015, y: -1 } : {}}
            whileTap={hasCv && !isAnalyzing ? { scale: 0.98 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={cn(
              'relative w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 overflow-hidden',
              hasCv && !isAnalyzing
                ? 'btn-gradient-animated text-white shadow-lg cursor-pointer'
                : 'bg-surface-3 text-muted cursor-not-allowed'
            )}
          >
            {hasCv && !isAnalyzing && (
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            )}
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Analysiere...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 relative z-10" />
                <span className="relative z-10 tracking-wide">Analyse starten</span>
                <span className="relative z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/15 text-xs font-bold">
                  <Zap className="w-3 h-3" />{costs.analysis}
                </span>
              </>
            )}
          </motion.button>
        )}

        {/* Contextual hints */}
        <AnimatePresence>
          {!hasCv && isLoggedIn && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-muted"
            >
              Lade zuerst deinen Lebenslauf hoch um fortzufahren
            </motion.p>
          )}
          {hasCv && isLoggedIn && hasCredits && !isAnalyzing && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-muted flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3 h-3 text-status-green" />
              {hasJob
                ? `Vollständige Analyse · ${balance} Credits verfügbar`
                : `Basis-Analyse · Stelle optional hinzufügen für mehr`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  )
}
